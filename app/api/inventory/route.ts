import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        category: 'asc',
      },
    });

    // İstatistikler
    const stats = {
      totalProducts: products.length,
      lowStock: products.filter(p => p.stock <= p.minStock).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      categories: [...new Set(products.map(p => p.category))].length,
    };

    return NextResponse.json({ products, stats });
  } catch (error) {
    console.error('Envanter getirme hatası:', error);
    return NextResponse.json(
      { error: 'Envanter getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, stock, minStock, unit, price, supplier } = body;

    // Zorunlu alanlar
    if (!name?.trim() || !category?.trim() || stock === undefined || stock === null || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Ürün adı, kategori, stok ve fiyat zorunludur' },
        { status: 400 }
      );
    }

    // Sayısal değer kontrolleri
    const parsedStock = parseInt(stock);
    const parsedMinStock = parseInt(minStock) || 10;
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { error: 'Geçersiz stok miktarı' },
        { status: 400 }
      );
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: 'Geçersiz fiyat değeri' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        stock: parsedStock,
        minStock: parsedMinStock,
        unit: unit?.trim() || 'adet',
        price: parsedPrice,
        supplier: supplier?.trim() || '',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Ürün oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, stock, minStock, unit, price, supplier } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID gerekli' },
        { status: 400 }
      );
    }

    // Zorunlu alanları kontrol et
    if (!name?.trim() || !category?.trim() || stock === undefined || stock === null || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Ürün adı, kategori, stok ve fiyat zorunludur' },
        { status: 400 }
      );
    }

    // Sayısal değer kontrolleri
    const parsedStock = parseInt(stock);
    const parsedMinStock = parseInt(minStock) || 10;
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { error: 'Geçersiz stok miktarı' },
        { status: 400 }
      );
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: 'Geçersiz fiyat değeri' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        category: category.trim(),
        stock: parsedStock,
        minStock: parsedMinStock,
        unit: unit?.trim() || 'adet',
        price: parsedPrice,
        supplier: supplier?.trim() || '',
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün güncellenemedi' },
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

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün silinemedi' },
      { status: 500 }
    );
  }
}
