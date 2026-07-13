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

  // Danh sách 19 Lesson Sets của Flow English
  const flowEnglishSets = [
    { title: 'Baseball Pig', desc: 'Luyện nghe câu chuyện về chú lợn chơi bóng chày.' },
    { title: 'Evil English Teacher', desc: 'Thử thách với câu chuyện thầy giáo tiếng Anh đáng sợ.' },
    { title: 'Fat Man', desc: 'Câu chuyện hài hước về người đàn ông mập mạp muốn giảm cân.' },
    { title: 'Female Seeks Male', desc: 'Bài học đàm thoại về chủ đề kết bạn bốn phương.' },
    { title: 'Goats Being Hired', desc: 'Câu chuyện kỳ lạ về những chú dê được thuê dọn cỏ.' },
    { title: 'Green Peanut Butter', desc: 'Luyện nghe chủ đề ẩm thực độc lạ.' },
    { title: 'Mama\'s Boys', desc: 'Câu chuyện đàm thoại về những chàng trai bám mẹ.' },
    { title: 'Man Injured', desc: 'Bài nghe phản xạ về tai nạn hy hữu.' },
    { title: 'Sick in India', desc: 'Chuyến du lịch đầy thử thách của một vị khách bị bệnh.' },
    { title: 'Starving Bug', desc: 'Luyện phản xạ về chú bọ hung đói bụng.' },
    { title: 'Super Cow', desc: 'Câu chuyện về chú bò siêu nhân cứu thế giới.' },
    { title: 'Eat Your Veggies', desc: 'Bài học khuyến khích ăn rau xanh tốt cho sức khỏe.' },
    { title: 'Green Tea', desc: 'Tập trung chủ đề đồ uống có lợi và trà xanh.' },
    { title: 'Lemon Dog Part 1', desc: 'Chú chó chanh phần 1 đầy ngộ nghĩnh.' },
    { title: 'Lemon Dog Pt 2', desc: 'Chú chó chanh phần 2 tiếp nối câu chuyện.' },
    { title: 'Mosquito', desc: 'Cuộc chiến hài hước với những chú muỗi phiền toái.' },
    { title: 'Movie Star', desc: 'Ước mơ trở thành siêu sao điện ảnh.' },
    { title: 'Roach Vacation', desc: 'Kỳ nghỉ độc lạ của gia đình nhà gián.' },
    { title: 'Sweet Dreams', desc: 'Luyện nghe phản xạ về giấc mơ ngọt ngào.' }
  ];

  console.log('Generating 19 Lesson Sets for Flow English...');
  for (let i = 0; i < flowEnglishSets.length; i++) {
    const setInfo = flowEnglishSets[i];
    const lessonSet = await prisma.lessonSet.create({
      data: {
        courseId: flowEnglish.id,
        title: setInfo.title,
        description: setInfo.desc,
        requiredDays: 7,
        orderIndex: i,
      }
    });

    // Tạo các bài học mẫu cho từng Set
    const mainLesson = await prisma.lesson.create({
      data: {
        lessonSetId: lessonSet.id,
        title: `${setInfo.title} - Main Audio`,
        type: LessonType.MAIN,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        orderIndex: 1,
        durationSeconds: 300
      }
    });

    const vocabLesson = await prisma.lesson.create({
      data: {
        lessonSetId: lessonSet.id,
        title: `${setInfo.title} - Vocabulary`,
        type: LessonType.VOCAB,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        orderIndex: 2,
        durationSeconds: 240
      }
    });

    const miniStoryLesson = await prisma.lesson.create({
      data: {
        lessonSetId: lessonSet.id,
        title: `${setInfo.title} - Mini Story`,
        type: LessonType.MINI_STORY,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        orderIndex: 3,
        durationSeconds: 420
      }
    });

    // Gieo phụ đề mẫu
    await prisma.transcript.createMany({
      data: [
        { lessonId: mainLesson.id, startTime: 0, endTime: 5, textContent: `This is the main article introduction for ${setInfo.title}.`, orderIndex: 1 },
        { lessonId: mainLesson.id, startTime: 5, endTime: 15, textContent: 'Listen carefully and repeat out loud.', orderIndex: 2 },
        { lessonId: vocabLesson.id, startTime: 0, endTime: 10, textContent: 'Learn key vocabulary words and expressions.', orderIndex: 1 },
        { lessonId: miniStoryLesson.id, startTime: 0, endTime: 5, textContent: `Hello, welcome to the mini story for ${setInfo.title}.`, orderIndex: 1 },
        { lessonId: miniStoryLesson.id, startTime: 5, endTime: 15, textContent: 'Answer all questions rapidly with a loud voice.', orderIndex: 2 },
      ]
    });
  }

  // 3. Create a fallback set for Original English
  const originalTeacher = await prisma.lessonSet.create({
    data: {
      courseId: originalEnglish.id,
      title: 'Intro to Original English',
      description: 'Luyện tập bài học nhập môn của Original Course.',
      requiredDays: 7,
      orderIndex: 0,
    }
  });

  const originalMain = await prisma.lesson.create({
    data: {
      lessonSetId: originalTeacher.id,
      title: 'Original Intro - Main Audio',
      type: LessonType.MAIN,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      orderIndex: 1,
      durationSeconds: 280
    }
  });

  await prisma.transcript.create({
    data: {
      lessonId: originalMain.id,
      startTime: 0,
      endTime: 10,
      textContent: 'Welcome to Original Effortless English. Let\'s begin with the rules.',
      orderIndex: 1
    }
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
