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

    const product = await prisma.product.create({
      data: {
        name,
        category,
        stock: parseInt(stock),
        minStock: parseInt(minStock) || 10,
        unit,
        price: parseFloat(price),
        supplier,
      },
    });

    return NextResponse.json(product);
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
    const { id, ...data } = body;

    if (data.stock) data.stock = parseInt(data.stock);
    if (data.minStock) data.minStock = parseInt(data.minStock);
    if (data.price) data.price = parseFloat(data.price);

    const product = await prisma.product.update({
      where: { id },
      data,
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
