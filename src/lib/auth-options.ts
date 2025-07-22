import { NextAuthOptions, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
          locale: profile.locale || 'en',
        };
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // E-posta adresine göre kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Kullanıcı bulunamadıysa veya şifre yoksa
        if (!user || !user.password) {
          return null;
        }

        // Şifre karşılaştırma
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          referralCode: user.referralCode,
          locale: user.locale || 'en',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // İlk oturum açma işleminde user objesi dolu gelir
      if (user) {
        token.id = user.id;
        token.referralCode = user.referralCode;
        token.locale = user.locale || 'en';
      }

      // Kullanıcı profili güncellendiğinde
      if (trigger === 'update' && session) {
        // Sadece oturum verisinde değişiklik olan alanları güncelle
        if (session.locale) token.locale = session.locale;
        if (session.referralCode) token.referralCode = session.referralCode;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.referralCode = token.referralCode as string | null;
        session.user.locale = token.locale as string || 'en';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Google ile giriş yaptığında referral kodu yoksa oluştur
      if (account?.provider === 'google' && user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { referralCode: true }
        });

        if (!dbUser?.referralCode) {
          const { referralService } = await import('@/lib/referral-service');
          await referralService.assignReferralCode(user.id);
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // URL başka bir site ise, baseUrl'e yönlendir
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      // Yeni kullanıcı oluşturulduğunda referral kodu ata
      if (user.id) {
        const { referralService } = await import('@/lib/referral-service');
        await referralService.assignReferralCode(user.id);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Oturum türü genişletmeleri
declare module 'next-auth' {
  interface User {
    id: string;
    referralCode?: string | null;
    locale?: string;
  }

  interface Session {
    user: {
      id: string;
      referralCode?: string | null;
      locale?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    referralCode?: string | null;
    locale?: string;
  }
}

export default authOptions;
