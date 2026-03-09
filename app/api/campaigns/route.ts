import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Kampanya getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kampanyalar getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, discount, startDate, endDate, status, services } = body;

    // Zorunlu alanlar
    if (!title?.trim() || discount === undefined || discount === null) {
      return NextResponse.json(
        { error: 'Başlık ve indirim oranı zorunludur' },
        { status: 400 }
      );
    }

    // Sayısal değer kontrolü
    const parsedDiscount = parseInt(discount);
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      return NextResponse.json(
        { error: 'İndirim oranı 0-100 arasında olmalıdır' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        discount: parsedDiscount,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date().toISOString(),
        status: status || 'active',
        services: services || '',
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Kampanya oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Kampanya oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, discount, startDate, endDate, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Kampanya ID gerekli' },
        { status: 400 }
      );
    }

    // Zorunlu alanları kontrol et
    if (!title?.trim() || discount === undefined || discount === null) {
      return NextResponse.json(
        { error: 'Başlık ve indirim oranı zorunludur' },
        { status: 400 }
      );
    }

    // Sayısal değerleri kontrol et
    const parsedDiscount = parseInt(discount);
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      return NextResponse.json(
        { error: 'İndirim oranı 0-100 arasında olmalıdır' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        discount: parsedDiscount,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date().toISOString(),
        status: status || 'active',
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Kampanya güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kampanya güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kampanya silme hatası:', error);
    return NextResponse.json(
      { error: 'Kampanya silinemedi' },
      { status: 500 }
    );
  }
}
