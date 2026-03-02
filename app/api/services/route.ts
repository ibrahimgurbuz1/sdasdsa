import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        appointments: {
          where: {
            status: 'completed',
          },
        },
      },
      orderBy: {
        category: 'asc',
      },
    });

    // Her hizmet için tamamlanan randevu sayısını ekle
    const servicesWithCount = services.map(service => ({
      ...service,
      completedCount: service.appointments.length,
      appointments: undefined, // Gereksiz veriyi kaldır
    }));

    return NextResponse.json(servicesWithCount);
  } catch (error) {
    console.error('Hizmetleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Hizmetler getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, duration, price, description } = body;

    if (!name || !category || !duration || price === undefined) {
      return NextResponse.json(
        { error: 'Ad, kategori, süre ve fiyat zorunludur' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        category,
        duration: String(duration),
        price: parseFloat(price),
        description: description || '',
        isActive: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Hizmet oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Hizmet oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, duration, price, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Hizmet ID gerekli' },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(duration && { duration: String(duration) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Hizmet güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Hizmet güncellenemedi' },
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
        { error: 'Hizmet ID gerekli' },
        { status: 400 }
      );
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Hizmet silindi' });
  } catch (error) {
    console.error('Hizmet silme hatası:', error);
    return NextResponse.json(
      { error: 'Hizmet silinemedi' },
      { status: 500 }
    );
  }
}
