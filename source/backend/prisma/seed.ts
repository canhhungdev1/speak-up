import { PrismaClient, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing old data...');
  // Delete in reverse order of relationships
  await prisma.transcript.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.lessonSet.deleteMany();
  await prisma.course.deleteMany();

  console.log('Seeding new data...');

  // 1. Create Courses
  const flowEnglish = await prisma.course.create({
    data: {
      title: 'Flow English',
      description: 'Khóa học giúp bạn nói tiếng Anh lưu loát, không cần dịch trong đầu. Dành cho người ở trình độ Trung cấp.',
      coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
      isPublished: true,
      orderIndex: 0,
    }
  });

  const originalEnglish = await prisma.course.create({
    data: {
      title: 'Original Effortless English',
      description: 'Khóa học nền tảng của thầy A.J. Hoge, phù hợp cho người mất gốc hoặc muốn xây dựng lại nền tảng.',
      coverImageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
      isPublished: true,
      orderIndex: 1,
    }
  });

  // 2. Create Lesson Sets
  const baseballPig = await prisma.lessonSet.create({
    data: {
      courseId: flowEnglish.id,
      title: 'Baseball Pig',
      description: 'Luyện nghe câu chuyện về chú lợn muốn chơi bóng chày.',
      requiredDays: 7,
      orderIndex: 0,
    }
  });

  const evilTeacher = await prisma.lessonSet.create({
    data: {
      courseId: originalEnglish.id,
      title: 'Evil English Teacher',
      description: 'Câu chuyện hài hước về một thầy giáo tiếng Anh tồi tệ.',
      requiredDays: 7,
      orderIndex: 1,
    }
  });

  // 3. Create Lessons for Baseball Pig
  const baseballMain = await prisma.lesson.create({
    data: {
      lessonSetId: baseballPig.id,
      title: 'Baseball Pig - Main Audio',
      type: LessonType.MAIN,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      orderIndex: 1,
      durationSeconds: 372
    }
  });

  const baseballVocab = await prisma.lesson.create({
    data: {
      lessonSetId: baseballPig.id,
      title: 'Baseball Pig - Vocabulary',
      type: LessonType.VOCAB,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      orderIndex: 2,
      durationSeconds: 420
    }
  });

  const baseballMiniStory = await prisma.lesson.create({
    data: {
      lessonSetId: baseballPig.id,
      title: 'Baseball Pig - Mini Story',
      type: LessonType.MINI_STORY,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      orderIndex: 3,
      durationSeconds: 510
    }
  });

  // 4. Create Transcripts for Baseball Pig
  await prisma.transcript.createMany({
    data: [
      { lessonId: baseballMain.id, startTime: 0, endTime: 5, textContent: 'There is a pig. He wants to be a baseball player.', orderIndex: 1 },
      { lessonId: baseballMain.id, startTime: 5, endTime: 10, textContent: 'Every day, he practices baseball.', orderIndex: 2 },
      { lessonId: baseballMain.id, startTime: 10, endTime: 15, textContent: 'He practices hitting a baseball.', orderIndex: 3 },
      { lessonId: baseballMain.id, startTime: 15, endTime: 25, textContent: 'He wants to be a big hitter.', orderIndex: 4 },
      
      { lessonId: baseballVocab.id, startTime: 0, endTime: 5, textContent: 'Pig - Con lợn, heo', orderIndex: 1 },
      { lessonId: baseballVocab.id, startTime: 5, endTime: 10, textContent: 'Baseball - Bóng chày', orderIndex: 2 },
      { lessonId: baseballVocab.id, startTime: 10, endTime: 15, textContent: 'Practice - Luyện tập', orderIndex: 3 },

      { lessonId: baseballMiniStory.id, startTime: 0, endTime: 5, textContent: 'Is there a dog?', orderIndex: 1 },
      { lessonId: baseballMiniStory.id, startTime: 5, endTime: 10, textContent: 'No, there isn\'t a dog. There is a pig.', orderIndex: 2 },
      { lessonId: baseballMiniStory.id, startTime: 10, endTime: 15, textContent: 'What does the pig want to be?', orderIndex: 3 },
      { lessonId: baseballMiniStory.id, startTime: 15, endTime: 25, textContent: 'He wants to be a baseball player.', orderIndex: 4 },
    ]
  });

  // 5. Create Lessons for Evil English Teacher
  const evilMain = await prisma.lesson.create({
    data: {
      lessonSetId: evilTeacher.id,
      title: 'Evil English Teacher - Main Audio',
      type: LessonType.MAIN,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      orderIndex: 1,
      durationSeconds: 300
    }
  });

  await prisma.transcript.createMany({
    data: [
      { lessonId: evilMain.id, startTime: 0, endTime: 5, textContent: 'There is an evil English teacher.', orderIndex: 1 },
      { lessonId: evilMain.id, startTime: 5, endTime: 10, textContent: 'He is a very bad teacher.', orderIndex: 2 },
      { lessonId: evilMain.id, startTime: 10, endTime: 15, textContent: 'He comes into his class.', orderIndex: 3 },
      { lessonId: evilMain.id, startTime: 15, endTime: 25, textContent: 'The students are sitting at their desks, waiting for him.', orderIndex: 4 },
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
