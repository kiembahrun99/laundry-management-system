import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const empHash = await bcrypt.hash("employee123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: adminHash, name: "Administrator", role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { username: "employee" },
    update: {},
    create: { username: "employee", password: empHash, name: "Employee", role: "EMPLOYEE" },
  });

  const services = [
    { name: "Regular Wash", pricePerKg: 7000, estimatedDays: 3, description: "Cuci + Setrika regular" },
    { name: "Express Wash", pricePerKg: 12000, estimatedDays: 1, description: "Cuci + Setrika express 1 hari" },
    { name: "Iron Only", pricePerKg: 5000, estimatedDays: 2, description: "Setrika saja" },
  ];
  for (const s of services) {
    const exists = await prisma.service.findFirst({ where: { name: s.name } });
    if (!exists) await prisma.service.create({ data: s });
  }

  const defaults: Record<string, string> = {
    laundry_name: "Laundry Express",
    address: "Jl. Mawar No. 123, Jakarta",
    phone: "0812-3456-7890",
    footer: "Thank you for using our service",
    receipt_note: "Barang yang tidak diambil >30 hari bukan tanggung jawab kami",
  };
  for (const [k, v] of Object.entries(defaults)) {
    await prisma.setting.upsert({ where: { key: k }, update: {}, create: { key: k, value: v } });
  }

  console.log("Seed completed");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
