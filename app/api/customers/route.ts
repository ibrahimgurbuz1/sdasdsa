import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tamamlanmış randevulardan müşteri bilgilerini çek
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'completed',
      },
      include: {
        service: true,
      },
    });

    // Müşterileri grupla
    const customerMap = new Map<string, {
      email: string;
      name: string;
      phone: string;
      totalVisits: number;
      totalSpent: number;
      lastVisit: string;
      services: string[];
    }>();

    appointments.forEach(apt => {
      const email = apt.customerEmail || 'unknown';
      const existing = customerMap.get(email);
      
      if (existing) {
        existing.totalVisits += 1;
        existing.totalSpent += apt.service.price;
        existing.services.push(apt.service.name);
        if (apt.date > existing.lastVisit) {
          existing.lastVisit = apt.date;
        }
      } else {
        customerMap.set(email, {
          email,
          name: apt.customerName || 'Bilinmiyor',
          phone: apt.customerPhone || '-',
          totalVisits: 1,
          totalSpent: apt.service.price,
          lastVisit: apt.date,
          services: [apt.service.name],
        });
      }
    });

    const customers = Array.from(customerMap.values()).map((c, index) => ({
      id: index + 1,
      ...c,
      rating: Math.min(5, Math.floor(3 + c.totalVisits / 5)), // Ziyaret sayısına göre rating
    }));

    // İstatistikler
    const stats = {
      totalCustomers: customers.length,
      avgVisits: customers.length > 0 
        ? Math.round(customers.reduce((sum, c) => sum + c.totalVisits, 0) / customers.length) 
        : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      avgRating: customers.length > 0 
        ? (customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1) 
        : '0.0',
    };

    return NextResponse.json({ customers, stats });
  } catch (error) {
    console.error('Müşteri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Müşteriler getirilemedi' },
      { status: 500 }
    );
  }
}
