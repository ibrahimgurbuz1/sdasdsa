import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Galeri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Galeri getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, imageUrl } = body;

    // Zorunlu alanlar
    if (!title?.trim() || !category?.trim() || !imageUrl?.trim()) {
      return NextResponse.json(
        { error: 'Başlık, kategori ve resim URL zorunludur' },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        imageUrl: imageUrl.trim(),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Galeri öğesi oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Galeri öğesi oluşturulamadı' },
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

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Galeri öğesi silme hatası:', error);
    return NextResponse.json(
      { error: 'Galeri öğesi silinemedi' },
      { status: 500 }
    );
  }
}
