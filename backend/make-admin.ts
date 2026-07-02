import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updatedUsers = await prisma.user.updateMany({
    data: {
      role: 'ADMIN',
    },
  });
  console.log(`Updated ${updatedUsers.count} users to ADMIN role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
