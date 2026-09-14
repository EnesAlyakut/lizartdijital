import { PrismaClient } from "@/generated/prisma";
import { initializeProductionData } from "./production-data";

initializeProductionData();

/**
 * Geliştirmede hot-reload sırasında yeni bağlantı havuzu açılmasını önlemek için
 * PrismaClient global üzerinde önbelleklenir.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
