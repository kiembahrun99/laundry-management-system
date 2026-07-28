import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const empHash = await bcrypt.hash("employee123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: adminHash, name: "Administrator", role: "ADMIN" },
  });
  const employee = await prisma.user.upsert({
    where: { username: "employee" },
    update: {},
    create: { username: "employee", password: empHash, name: "Employee", role: "EMPLOYEE" },
  });

  // Services
  const servicesData = [
    { name: "Regular Wash", pricePerKg: 7000, estimatedDays: 3, description: "Cuci + Setrika regular" },
    { name: "Express Wash", pricePerKg: 12000, estimatedDays: 1, description: "Cuci + Setrika express 1 hari" },
    { name: "Iron Only", pricePerKg: 5000, estimatedDays: 2, description: "Setrika saja" },
    { name: "Dry Cleaning", pricePerKg: 15000, estimatedDays: 2, description: "Dry cleaning premium" },
    { name: "Bed Cover Wash", pricePerKg: 10000, estimatedDays: 3, description: "Cuci bed cover & selimut" },
  ];
  for (const s of servicesData) {
    const exists = await prisma.service.findFirst({ where: { name: s.name } });
    if (!exists) await prisma.service.create({ data: s });
  }
  const services = await prisma.service.findMany();

  // Settings
  const defaults: Record<string, string> = {
    laundry_name: "Laundry Express",
    address: "Jl. Mawar No. 123, Jakarta Selatan",
    phone: "0812-3456-7890",
    footer: "Thank you for using our service - Cuci Bersih Harga Bersahabat",
    receipt_note: "Barang yang tidak diambil >30 hari bukan tanggung jawab kami",
  };
  for (const [k, v] of Object.entries(defaults)) {
    await prisma.setting.upsert({ where: { key: k }, update: {}, create: { key: k, value: v } });
  }

  // Dummy Customers (20)
  const dummyCustomers = [
    { name: "Budi Santoso", phone: "081201111001", address: "Jl. Anggrek No 5, Jakarta", notes: "Pelanggan setia" },
    { name: "Siti Aminah", phone: "081201111002", address: "Jl. Melati No 12, Bandung", notes: null },
    { name: "Andi Wijaya", phone: "081201111003", address: "Jl. Kenanga No 8, Surabaya", notes: "Langganan express" },
    { name: "Dewi Lestari", phone: "081201111004", address: "Jl. Mawar No 20, Jakarta", notes: null },
    { name: "Rudi Hartono", phone: "081201111005", address: "Jl. Dahlia No 3, Bekasi", notes: "Minta diantar jam 5 sore" },
    { name: "Lina Marlina", phone: "081201111006", address: "Jl. Tulip No 15, Depok", notes: null },
    { name: "Joko Pranoto", phone: "081201111007", address: "Jl. Flamboyan No 22, Bogor", notes: null },
    { name: "Rina Wati", phone: "081201111008", address: "Jl. Cempaka No 9, Jakarta", notes: "Cuci + setrika wangi" },
    { name: "Agus Saputra", phone: "081201111009", address: "Jl. Nusa Indah No 11, Tangerang", notes: null },
    { name: "Fitri Handayani", phone: "081201111010", address: "Jl. Gatot Subroto No 30, Jakarta", notes: "Member gold" },
    { name: "Hendra Gunawan", phone: "081201111011", address: "Jl. Sudirman No 45, Jakarta", notes: null },
    { name: "Maya Sari", phone: "081201111012", address: "Jl. Thamrin No 18, Jakarta", notes: null },
    { name: "Eko Prasetyo", phone: "081201111013", address: "Jl. Kuningan No 7, Jakarta", notes: "Jemput hari Senin" },
    { name: "Nurul Huda", phone: "081201111014", address: "Jl. Mangga Dua No 14, Jakarta", notes: null },
    { name: " Bambang S", phone: "081201111015", address: "Jl. Kelapa Gading No 25, Jakarta", notes: null },
    { name: "Yuni Astuti", phone: "081201111016", address: "Jl. Pondok Indah No 6, Jakarta", notes: "Bed cover customer" },
    { name: "Slamet Riyadi", phone: "081201111017", address: "Jl. Tebet No 33, Jakarta", notes: null },
    { name: "Indah Permata", phone: "081201111018", address: "Jl. Kemang No 19, Jakarta", notes: null },
    { name: "Doni Firmansyah", phone: "081201111019", address: "Jl. Senayan No 2, Jakarta", notes: "Express only" },
    { name: "Anisa Rahma", phone: "081201111020", address: "Jl. Blok M No 28, Jakarta", notes: null },
  ];

  for (const c of dummyCustomers) {
    const exists = await prisma.customer.findUnique({ where: { phone: c.phone } });
    if (!exists) {
      await prisma.customer.create({ data: { name: c.name.trim(), phone: c.phone, address: c.address, notes: c.notes } });
    }
  }
  const customers = await prisma.customer.findMany();
  console.log(`Customers: ${customers.length}`);

  // Dummy Orders (25)
  const statuses: any[] = ["RECEIVED", "WASHING", "DRYING", "IRONING", "FINISHED", "PICKED_UP"];
  const payStatuses: any[] = ["UNPAID", "DP", "PAID"];
  const existingOrders = await prisma.order.count();
  if (existingOrders < 20) {
    for (let i = 0; i < 25; i++) {
      const customer = customers[randInt(0, customers.length - 1)];
      const service = services[randInt(0, services.length - 1)];
      const weight = randInt(1, 10) + Math.random();
      const price = service.pricePerKg * weight;
      const discount = Math.random() > 0.7 ? randInt(1, 5) * 1000 : 0;
      const total = price - discount;
      const createdDaysAgo = randInt(0, 15);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - createdDaysAgo);
      createdAt.setHours(randInt(8, 17), randInt(0, 59));

      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const tomorrow = new Date(todayStart); tomorrow.setDate(tomorrow.getDate() + 1);
      // simple invoice number
      const invDate = createdAt;
      const y = invDate.getFullYear();
      const m = String(invDate.getMonth() + 1).padStart(2, "0");
      const dd = String(invDate.getDate()).padStart(2, "0");
      const seq = String(i + 1).padStart(4, "0");
      const invoice = `INV-${y}${m}${dd}-${seq}`;

      const existsInv = await prisma.order.findUnique({ where: { invoiceNumber: invoice } });
      if (existsInv) continue;

      const oStatus = statuses[randInt(0, statuses.length - 1)];
      const pStatus = oStatus === "PICKED_UP" ? "PAID" : payStatuses[randInt(0, payStatuses.length - 1)];

      try {
        const order = await prisma.order.create({
          data: {
            invoiceNumber: invoice,
            customerId: customer.id,
            serviceId: service.id,
            weight: parseFloat(weight.toFixed(1)),
            price,
            discount,
            total,
            paymentStatus: pStatus,
            orderStatus: oStatus,
            createdById: i % 2 === 0 ? admin.id : employee.id,
            notes: Math.random() > 0.5 ? "Handle with care" : null,
            createdAt,
          },
        });

        // Order logs timeline
        await prisma.orderLog.create({
          data: { orderId: order.id, status: "RECEIVED", description: "Order created", createdById: order.createdById, createdAt },
        });
        if (oStatus !== "RECEIVED") {
          const secondLogDate = new Date(createdAt.getTime() + 3600000 * randInt(1, 5));
          const midStatus = statuses[Math.min(statuses.indexOf(oStatus), randInt(1, 3))];
          if (midStatus !== "RECEIVED") {
            await prisma.orderLog.create({
              data: { orderId: order.id, status: midStatus, description: `Status changed to ${midStatus}`, createdById: order.createdById, createdAt: secondLogDate },
            });
          }
          if (oStatus !== midStatus) {
            const thirdLogDate = new Date(secondLogDate.getTime() + 3600000 * randInt(1, 12));
            await prisma.orderLog.create({
              data: { orderId: order.id, status: oStatus, description: `Status changed to ${oStatus}`, createdById: order.createdById, createdAt: thirdLogDate },
            });
          }
        }

        // Payments for some orders
        if (pStatus !== "UNPAID") {
          const paidDate = new Date(createdAt.getTime() + 3600000 * randInt(0, 24));
          const amount = pStatus === "PAID" ? total : total * 0.5;
          await prisma.payment.create({
            data: {
              orderId: order.id,
              amount,
              method: ["CASH", "TRANSFER", "QRIS"][randInt(0, 2)] as any,
              paidDate,
              paidById: order.createdById,
              createdAt: paidDate,
            },
          });
        }

        await prisma.transactionLog.create({
          data: { action: "CREATE", entity: "orders", entityId: order.id, description: `Created order ${invoice}`, userId: order.createdById, createdAt },
        });
      } catch (e) {
        // ignore duplicate invoice errors
      }
    }
    console.log("Dummy orders created");
  }

  console.log("Seed completed with dummy data");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
