'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { signIn } from 'next-auth/react';

/**
 * Kullanıcı kaydı için server action
 */
export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string || null;
  const locale = formData.get('locale') as string || 'en';

  // Temel doğrulama
  if (!email || !password || !firstName || !lastName) {
    return { success: false, message: 'Required fields are missing' };
  }

  try {
    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, message: 'Email already in use' };
    }

    // Şifre hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        phone,
        locale,
        membership: 'STANDARD',
        status: 'ACTIVE',
      },
    });

    // Referral kodu ata
    const { referralService } = await import('@/lib/referral-service');
    await referralService.assignReferralCode(user.id);

    // Yeni kullanıcıyla oturum açma işlemi
    await signIn('credentials', {
      email,
      password,
      callbackUrl: `/${locale}`
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Server error during registration' };
  }
}

/**
 * Giriş işlemi için server action
 */
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'en';
  const callbackUrl = formData.get('callbackUrl') as string || `/${locale}`;

  try {
    await signIn('credentials', {
      email,
      password,
      callbackUrl
    });
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Invalid email or password' };
  }
}
