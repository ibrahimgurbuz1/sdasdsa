import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

if (process.env.DATABASE_URL?.startsWith('libsql://')) {
  // Turso/LibSQL connection
  const url = process.env.DATABASE_URL.split('?')[0];
  const authToken = process.env.DATABASE_URL.split('authToken=')[1];
  
  const libsql = createClient({
    url: url,
    authToken: authToken
  });
  
  const adapter = new PrismaLibSql(libsql);
  prismaInstance = new PrismaClient({ adapter });
} else {
  // Regular SQLite/MySQL connection
  prismaInstance = new PrismaClient();
}

export const prisma = globalThis.prisma || prismaInstance;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
