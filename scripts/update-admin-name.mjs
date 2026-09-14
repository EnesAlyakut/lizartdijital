import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: { select: { name: true } } },
  });
  console.log("Mevcut Kullanıcılar:", users);

  const updated = await prisma.user.updateMany({
    where: { email: "admin@lizartdijital.com" },
    data: { fullName: "Lizart Dijital" },
  });
  console.log("Güncellenen admin sayısı:", updated.count);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
