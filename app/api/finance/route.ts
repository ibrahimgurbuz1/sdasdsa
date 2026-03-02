import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tamamlanan randevuları getir
    const completedAppointments = await prisma.appointment.findMany({
      where: {
        status: 'completed',
      },
      include: {
        service: true,
        staff: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Günlük gelirler - son 30 gün
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Toplam gelir
    const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.service.price, 0);

    // Son işlemler
    const recentTransactions = completedAppointments.slice(0, 10).map(apt => ({
      id: apt.id,
      type: 'income',
      description: `${apt.service.name} - ${apt.customerName || 'Müşteri'}`,
      amount: apt.service.price,
      date: apt.date,
      time: apt.time,
      staff: apt.staff.name,
    }));

    // Hizmet bazlı gelir dağılımı
    const serviceRevenue = new Map<string, number>();
    completedAppointments.forEach(apt => {
      const current = serviceRevenue.get(apt.service.name) || 0;
      serviceRevenue.set(apt.service.name, current + apt.service.price);
    });

    const revenueByService = Array.from(serviceRevenue.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Personel bazlı gelir
    const staffRevenue = new Map<string, number>();
    completedAppointments.forEach(apt => {
      const current = staffRevenue.get(apt.staff.name) || 0;
      staffRevenue.set(apt.staff.name, current + apt.service.price);
    });

    const revenueByStaff = Array.from(staffRevenue.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Günlük gelir (son 7 gün)
    const dailyRevenue: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = completedAppointments
        .filter(apt => apt.date === dateStr)
        .reduce((sum, apt) => sum + apt.service.price, 0);
      
      dailyRevenue.push({
        date: dateStr,
        revenue: dayRevenue,
      });
    }

    // İstatistikler
    const stats = {
      totalRevenue,
      totalTransactions: completedAppointments.length,
      avgTransaction: completedAppointments.length > 0 
        ? Math.round(totalRevenue / completedAppointments.length) 
        : 0,
      todayRevenue: completedAppointments
        .filter(apt => apt.date === today.toISOString().split('T')[0])
        .reduce((sum, apt) => sum + apt.service.price, 0),
    };

    return NextResponse.json({
      stats,
      recentTransactions,
      revenueByService,
      revenueByStaff,
      dailyRevenue,
    });
  } catch (error) {
    console.error('Finans verisi getirme hatası:', error);
    return NextResponse.json(
      { error: 'Finans verileri getirilemedi' },
      { status: 500 }
    );
  }
}
