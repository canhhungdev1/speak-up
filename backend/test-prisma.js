const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Querying local DB...');
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { lessonSets: true }
      }
    }
  });
  console.log('Found courses:', JSON.stringify(courses, null, 2));
}

main()
  .catch(e => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
