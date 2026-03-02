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

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        discount: parseInt(discount),
        startDate,
        endDate,
        status: status || 'active',
        services,
      },
    });

    return NextResponse.json(campaign);
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
    const { id, ...data } = body;

    if (data.discount) {
      data.discount = parseInt(data.discount);
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data,
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
