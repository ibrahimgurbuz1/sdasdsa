import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentConfirmationEmail, sendAppointmentReceivedEmail } from '@/lib/email';
import { getAdminSessionFromRequest } from '@/lib/adminAuth';
import { strictApiRateLimit } from '@/lib/rateLimit';
import { sanitizeString, sanitizeEmail, validateEmail, validatePhone } from '@/lib/validation';

// Tüm randevuları getir veya yeni randevu oluştur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');
    const email = searchParams.get('email');
    const session = getAdminSessionFromRequest(request);

    // Public access: only availability lookup for booking flow.
    if (!session) {
      if (!staffId || !date) {
        return NextResponse.json(
          { error: 'Bu endpoint için yetki gerekli' },
          { status: 401 }
        );
      }

      const publicAppointments = await prisma.appointment.findMany({
        where: {
          staffId,
          date,
          status: {
            not: 'cancelled',
          },
        },
        select: {
          id: true,
          time: true,
          status: true,
          service: {
            select: {
              duration: true,
            },
          },
        },
        orderBy: [{ time: 'asc' }],
      });

      return NextResponse.json(publicAppointments);
    }

    const where: any = {};
    if (staffId) where.staffId = staffId;
    if (date) where.date = date;
    if (email) where.customerEmail = sanitizeEmail(email);

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        staff: true,
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Randevuları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Randevular getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const rateLimitResult = await strictApiRateLimit.check(`appointment:${ip}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Çok fazla randevu denemesi yapıldı. Lütfen biraz sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userId, staffId, serviceId, date, time, customerName, customerPhone, customerEmail, notes } = body;

    if (!staffId || !serviceId || !date || !time || !customerName || !customerPhone || !customerEmail) {
      return NextResponse.json(
        { error: 'Personel, hizmet, tarih, saat, ad, telefon ve email zorunludur' },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeString(String(customerName));
    const sanitizedPhone = sanitizeString(String(customerPhone));
    const sanitizedEmail = sanitizeEmail(String(customerEmail));
    const sanitizedNotes = notes ? sanitizeString(String(notes)) : '';

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    if (!validatePhone(sanitizedPhone)) {
      return NextResponse.json(
        { error: 'Geçerli bir telefon numarası giriniz' },
        { status: 400 }
      );
    }

    const selectedService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!selectedService) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 400 }
      );
    }

    const toMinutes = (value: string) => {
      const [h, m] = value.split(':').map(Number);
      return h * 60 + m;
    };

    const parseDuration = (value: string) => {
      const parsed = parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
    };

    const requestedStart = toMinutes(time);
    const requestedEnd = requestedStart + parseDuration(String(selectedService.duration));

    // Çakışma kontrolü
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        staffId,
        date,
        status: {
          not: 'cancelled',
        },
      },
      include: {
        service: {
          select: {
            duration: true,
          },
        },
      },
    });

    const hasConflict = existingAppointments.some((appointment) => {
      const existingStart = toMinutes(appointment.time);
      const existingEnd = existingStart + parseDuration(String(appointment.service?.duration || '30'));
      return requestedStart < existingEnd && existingStart < requestedEnd;
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Seçilen saat aralığı dolu' },
        { status: 400 }
      );
    }

    // Yeni randevu oluştur
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        staffId,
        serviceId,
        date,
        time,
        customerName: sanitizedName,
        customerPhone: sanitizedPhone,
        customerEmail: sanitizedEmail,
        notes: sanitizedNotes,
        status: 'pending',
      },
      include: {
        staff: true,
        service: true,
        user: true,
      },
    });

    // Randevu işleme alındı e-postası gönder
    if (sanitizedEmail) {
      const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      sendAppointmentReceivedEmail({
        customerName: sanitizedName || 'Değerli Müşterimiz',
        customerEmail: sanitizedEmail,
        date: formattedDate,
        time,
        serviceName: appointment.service?.name || 'Belirtilmedi',
        staffName: appointment.staff?.name || 'Belirtilmedi',
      }).catch(err => console.error('E-posta gönderme hatası:', err));
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Randevu oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID ve status zorunludur' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        staff: true,
        service: true,
        user: true,
      },
    });

    // Randevu onaylandığında e-posta gönder
    if (status === 'confirmed' && appointment.customerEmail) {
      sendAppointmentConfirmationEmail({
        customerName: appointment.customerName || appointment.user?.name || 'Değerli Müşterimiz',
        customerEmail: appointment.customerEmail,
        date: appointment.date,
        time: appointment.time,
        serviceName: appointment.service?.name || 'Hizmet',
        staffName: appointment.staff?.name || 'Uzman',
      }).catch(err => console.error('Onay e-postası gönderme hatası:', err));
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Randevu güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Randevu güncellenemedi' },
      { status: 500 }
    );
  }
}
