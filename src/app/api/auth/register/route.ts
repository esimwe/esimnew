import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;
    const phone = data.get('phone') as string || null;
    
    // Temel doğrulama
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Şifre hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        locale: 'en', // Varsayılan dil
        membership: 'STANDARD', // Varsayılan üyelik tipi
      },
    });
    
    // Referral kodu ata (güvenli implementasyon)
    try {
      const { referralServiceSafe } = await import('@/lib/referral-service-safe');
      await referralServiceSafe.assignReferralCode(user.id);
    } catch (error) {
      console.error('Referral kodu atanırken hata oluştu:', error);
      // Referral kodu atama hatası kritik değil, işleme devam et
    }
    
    // Başarılı yanıt
    return NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration' },
      { status: 500 }
    );
  }
}
