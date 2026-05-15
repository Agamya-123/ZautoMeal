import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database for a fresh start...');
  
  const orderCount = await prisma.order.deleteMany({});
  console.log(`Deleted ${orderCount.count} orders.`);
  
  const scheduleCount = await prisma.schedule.deleteMany({});
  console.log(`Deleted ${scheduleCount.count} schedules.`);
  
  const settingsCount = await prisma.settings.deleteMany({});
  console.log(`Deleted ${settingsCount.count} settings.`);

  console.log('Database is now fresh!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
