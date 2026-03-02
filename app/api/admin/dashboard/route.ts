import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7);

    // Paralel veri çekme
    const [
      allAppointments,
      totalCustomersData,
      recentAppointments,
    ] = await Promise.all([
      // Verimlilik için tüm randevuları çekip JS tarafında filtreleyelim (Hata payını azaltır)
      prisma.appointment.findMany({
        include: { service: true, staff: true },
      }),
      
      // Toplam müşteri sayısı (unique email)
      prisma.appointment.groupBy({
        by: ['customerEmail'],
        _count: true,
      }),
      
      // Son 10 randevu (Yaratılma tarihine göre)
      prisma.appointment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { service: true, staff: true },
      }),
    ]);

    // JavaScript tarafında istatistikleri hesapla (Veritabanı format farklarını bypass etmek için en güvenli yol)
    const todayAppointments = allAppointments.filter(apt => apt.date === todayStr || apt.date.includes(todayStr));
    const monthlyAppointments = allAppointments.filter(apt => 
      apt.date.includes(currentMonthStr) && (apt.status === 'confirmed' || apt.status === 'completed' || apt.status === 'pending')
    );

    const monthlyRevenue = monthlyAppointments.reduce((total, apt) => total + (apt.service?.price || 0), 0);
    const averageValue = monthlyAppointments.length > 0 ? Math.round(monthlyRevenue / monthlyAppointments.length) : 0;

    // Son 6 ayın gelir verisi
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toISOString().substring(0, 7);
      const mRev = allAppointments
        .filter(apt => apt.date.includes(mStr) && (apt.status === 'confirmed' || apt.status === 'completed' || apt.status === 'pending'))
        .reduce((t, a) => t + (a.service?.price || 0), 0);
      
      revenueData.push({
        name: d.toLocaleDateString('tr-TR', { month: 'short' }),
        gelir: mRev,
      });
    }

    // Son 7 günün randevu sayısı
    const appointmentData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const count = allAppointments.filter(apt => apt.date.includes(dStr)).length;
      
      const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      appointmentData.push({
        name: dayNames[d.getDay()],
        randevu: count,
      });
    }

    return NextResponse.json({
      stats: {
        todayAppointments: todayAppointments.length,
        totalCustomers: totalCustomersData.length,
        monthlyRevenue,
        averageValue,
      },
      revenueData,
      appointmentData,
      serviceDistribution: [], // Performans için boş bırakılabilir veya hesaplanabilir
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        customerName: apt.customerName,
        service: apt.service?.name || 'Bilinmiyor',
        time: apt.time || 'Belirtilmedi',
        status: apt.status === 'completed' ? 'Tamamlandı' : 
                apt.status === 'confirmed' ? 'Onaylandı' : 
                apt.status === 'pending' ? 'Bekliyor' : 'İptal',
        staff: apt.staff?.name || 'Atanmadı',
      })),
      confirmedAppointments: allAppointments
        .filter(apt => apt.status === 'confirmed')
        .map(apt => ({
          id: apt.id,
          customerName: apt.customerName,
          customerEmail: apt.customerEmail,
          service: apt.service?.name || 'Bilinmiyor',
          date: apt.date,
          time: apt.time || 'Belirtilmedi',
          staff: apt.staff?.name || 'Atanmadı',
          price: apt.service?.price || 0,
        })),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Veri yükleme hatası' }, { status: 500 });
  }
}
