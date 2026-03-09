import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type GalleryPayload = {
  title?: string;
  category?: string;
  imageUrl?: string;
  type?: 'image' | 'video';
  url?: string;
};

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Galeri getirme hatasi:', error);
    return NextResponse.json({ error: 'Galeri getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GalleryPayload;

    const resolvedType = body.type || (body.category === 'video' ? 'video' : 'image');
    const resolvedUrl = (body.url || body.imageUrl || '').trim();
    const resolvedTitle = (body.title || 'Yeni Medya').trim();

    if (!resolvedUrl) {
      return NextResponse.json({ error: 'Medya URL zorunludur' }, { status: 400 });
    }

    if (resolvedType !== 'image' && resolvedType !== 'video') {
      return NextResponse.json({ error: 'Medya tipi image veya video olmalidir' }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: resolvedTitle,
        category: resolvedType,
        imageUrl: resolvedUrl,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Galeri ogesi olusturma hatasi:', error);
    return NextResponse.json({ error: 'Galeri ogesi olusturulamadi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Galeri ogesi silme hatasi:', error);
    return NextResponse.json({ error: 'Galeri ogesi silinemedi' }, { status: 500 });
  }
}
