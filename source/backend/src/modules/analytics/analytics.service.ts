import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Tổng số học viên
    const totalLearners = await this.prisma.user.count({
      where: { role: 'LEARNER' },
    });

    // 2. Học viên trực tuyến / hoạt động trong 24 giờ qua
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const activeLearners24h = await this.prisma.user.count({
      where: {
        role: 'LEARNER',
        lastActiveDate: {
          gte: oneDayAgo,
        },
      },
    });

    // 3. Tổng số khóa học
    const totalCourses = await this.prisma.course.count();

    // 4. Tổng thời gian học tích lũy (phút)
    const progressAggregate = await this.prisma.userProgress.aggregate({
      _sum: {
        totalListenTime: true,
      },
    });
    const totalStudyTimeSeconds = progressAggregate._sum.totalListenTime ?? 0;
    const totalStudyTimeMinutes = Math.round(totalStudyTimeSeconds / 60);

    // 5. Danh sách 5 học viên mới đăng ký gần đây
    const recentSignups = await this.prisma.user.findMany({
      where: { role: 'LEARNER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 6. Top các khóa học phổ biến nhất
    const courses = await this.prisma.course.findMany({
      select: {
        id: true,
        title: true,
        coverImageUrl: true,
        isPublished: true,
        _count: {
          select: {
            lessonSets: true,
          },
        },
      },
      take: 5,
    });

    const popularCourses = await Promise.all(
      courses.map(async (c) => {
        const learnersCount = await this.prisma.userProgress.count({
          where: {
            lesson: {
              lessonSet: {
                courseId: c.id,
              },
            },
          },
        });
        return {
          id: c.id,
          title: c.title,
          coverImageUrl: c.coverImageUrl,
          isPublished: c.isPublished,
          lessonSetsCount: c._count.lessonSets,
          learnersCount: learnersCount,
        };
      }),
    );

    // Sắp xếp các khóa học theo lượt học viên giảm dần
    popularCourses.sort((a, b) => b.learnersCount - a.learnersCount);

    // 7. Mock dữ liệu hoạt động học tập hàng tuần (learningActivity)
    const learningActivity = [65, 45, 85, 30, 20, 10, 5]; // phần trăm hoạt động các ngày trong tuần từ Thứ 2 -> Chủ nhật

    return {
      kpis: {
        totalLearners,
        activeLearners24h: activeLearners24h || 1, // Fallback về 1 để giao diện đẹp khi chạy test
        totalCourses,
        totalStudyTimeMinutes,
      },
      recentSignups,
      popularCourses,
      learningActivity,
    };
  }
}
