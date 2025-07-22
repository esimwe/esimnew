'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { signIn } from '@/lib/auth-actions-helpers';

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
        locale,
        membership: 'STANDARD',
      },
    });

    // Referral kodu ata
    const { referralService } = await import('@/lib/referral-service');
    await referralService.assignReferralCode(user.id);

    // Redirect to login page with success message
    return { success: true, redirect: `/${locale}/login?registered=true` };
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
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Admin kontrolü - admin dashboard'a yönlendiriyorsak
    if (callbackUrl.includes('/admin/') && user.membership !== 'ADMIN') {
      return { success: false, message: 'You do not have admin access' };
    }
    
    // Başarılı giriş - redirect URL döndür
    return { 
      success: true, 
      redirect: callbackUrl
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Server error during login' };
  }
}
