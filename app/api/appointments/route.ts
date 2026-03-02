import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentConfirmationEmail, sendAppointmentReceivedEmail } from '@/lib/email';

// Tüm randevuları getir veya yeni randevu oluştur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');
    const email = searchParams.get('email');

    const where: any = {};
    if (staffId) where.staffId = staffId;
    if (date) where.date = date;
    if (email) where.customerEmail = email;

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
    const body = await request.json();
    const { userId, staffId, serviceId, date, time, customerName, customerPhone, customerEmail, notes } = body;

    // Çakışma kontrolü
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId,
        date,
        time,
        status: {
          not: 'cancelled',
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Bu saat için zaten bir randevu var' },
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
        customerName,
        customerPhone,
        customerEmail,
        notes,
        status: 'pending',
      },
      include: {
        staff: true,
        service: true,
        user: true,
      },
    });

    // Randevu işleme alındı e-postası gönder
    if (customerEmail) {
      const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      sendAppointmentReceivedEmail({
        customerName: customerName || 'Değerli Müşterimiz',
        customerEmail,
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
      await sendAppointmentConfirmationEmail({
        customerName: appointment.customerName || appointment.user?.name || 'Değerli Müşterimiz',
        customerEmail: appointment.customerEmail,
        date: appointment.date,
        time: appointment.time,
        serviceName: appointment.service?.name || 'Hizmet',
        staffName: appointment.staff?.name || 'Uzman',
      });
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
