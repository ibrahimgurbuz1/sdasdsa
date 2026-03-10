import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialty: true,
        categories: true,
        workdayStart: true,
        workdayEnd: true,
        weekendStart: true,
        weekendEnd: true,
        workingDays: true,
        avatar: true,
        isActive: true,
        _count: {
          select: {
            appointments: {
              where: { status: 'completed' }
            }
          }
        }
      },
    });

    // Performans verileri ekle
    const staffWithPerformance = staff.map(member => {
      const totalAppointments = member._count.appointments;
      // Simplified revenue calculation (can be optimized with aggregation if needed)
      const avgRating = totalAppointments > 0 ? Math.min(5, 3 + totalAppointments / 10) : 0;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        specialty: member.specialty,
        categories: member.categories,
        workdayStart: member.workdayStart,
        workdayEnd: member.workdayEnd,
        weekendStart: member.weekendStart,
        weekendEnd: member.weekendEnd,
        workingDays: member.workingDays,
        avatar: member.avatar,
        isActive: member.isActive,
        totalAppointments,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    });

    return NextResponse.json(staffWithPerformance, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Personel getirme hatası:', error);
    return NextResponse.json(
      { error: 'Personel getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, specialty, categories, workdayStart, workdayEnd, weekendStart, weekendEnd, workingDays, avatar, isActive } = body;

    if (!name || !email || !phone || !specialty || !categories) {
      return NextResponse.json(
        { error: 'Ad, e-posta, telefon, uzmanlık ve kategoriler zorunludur' },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existing = await prisma.staff.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        phone,
        specialty,
        categories: typeof categories === 'object' ? JSON.stringify(categories) : categories,
        workdayStart: workdayStart || '09:00',
        workdayEnd: workdayEnd || '19:00',
        weekendStart: weekendStart || '10:00',
        weekendEnd: weekendEnd || '18:00',
        workingDays: workingDays ? (typeof workingDays === 'object' ? JSON.stringify(workingDays) : workingDays) : '[1,2,3,4,5]',
        avatar: avatar || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Personel oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Personel oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, specialty, categories, workdayStart, workdayEnd, weekendStart, weekendEnd, workingDays, avatar, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Personel ID gerekli' },
        { status: 400 }
      );
    }

    // Zorunlu alanları kontrol et
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !specialty?.trim() || !categories) {
      return NextResponse.json(
        { error: 'Ad, e-posta, telefon, uzmanlık ve kategoriler zorunludur' },
        { status: 400 }
      );
    }

    // E-posta format kontrolü
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // E-posta benzersizliği kontrolü (kendi kaydı hariç)
    const existing = await prisma.staff.findUnique({ where: { email: email.trim() } });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi başka bir personel tarafından kullanılıyor' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialty: specialty.trim(),
        categories: typeof categories === 'object' ? JSON.stringify(categories) : categories,
        workdayStart: workdayStart || '09:00',
        workdayEnd: workdayEnd || '19:00',
        weekendStart: weekendStart || '10:00',
        weekendEnd: weekendEnd || '18:00',
        workingDays: workingDays ? (typeof workingDays === 'object' ? JSON.stringify(workingDays) : workingDays) : '[1,2,3,4,5]',
        avatar: avatar || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Personel güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Personel güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Personel ID gerekli' },
        { status: 400 }
      );
    }

    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ message: 'Personel silindi' });
  } catch (error) {
    console.error('Personel silme hatası:', error);
    return NextResponse.json(
      { error: 'Personel silinemedi' },
      { status: 500 }
    );
  }
}
