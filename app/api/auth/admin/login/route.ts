import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      );
    }

    // Şifreyi çıkartarak döndür
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      user: adminWithoutPassword,
    });
  } catch (error) {
    console.error('Admin login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılamadı' },
      { status: 500 }
    );
  }
}
