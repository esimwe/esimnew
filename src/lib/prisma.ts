import { PrismaClient } from '@prisma/client';

// PrismaClient nesnesini global objesi üzerinde sakla (geliştirme sırasında hot reload'da yeni bağlantı açılmasını engeller)
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Geliştirme ortamında birden fazla PrismaClient örneği oluşturulmasını önle
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
