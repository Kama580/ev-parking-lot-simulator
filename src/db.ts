import "dotenv/config";
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: databaseUrl,
  }),
});