import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { loginRateLimit } from '@/lib/rateLimit';
import { sanitizeEmail, validateEmail } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Validate email format
    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Rate limiting (by IP)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const rateLimitResult = await loginRateLimit.check(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: sanitizedEmail },
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

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: adminWithoutPassword,
    });

    // Set HTTP-only cookie for server-side auth
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılamadı' },
      { status: 500 }
    );
  }
}
