import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: string; // 'audio', 'vocab', 'story', 'pov'
  completed: boolean;
}

interface LessonSet {
  id: number;
  title: string;
  isOpen: boolean;
  lessons: Lesson[];
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss'
})
export class CourseDetail implements OnInit {
  courseId: string | null = '';
  
  // Thông tin giả lập của khóa học
  course = {
    title: 'Original English',
    level: 'Beginner',
    description: 'The classic foundation for learning to speak English automatically. Master the basics with deep learning.',
    progress: 35,
    totalLessons: 30,
    color: '#3b82f6'
  };

  // Mock data cho danh sách bài học (Accordion)
  lessonSets: LessonSet[] = [
    {
      id: 1,
      title: 'Set 1: A Kiss',
      isOpen: true, // Mở sẵn Set đầu tiên
      lessons: [
        { id: 101, title: 'Main Audio Article', duration: '12:45', type: 'audio', completed: true },
        { id: 102, title: 'Vocabulary Lesson', duration: '18:20', type: 'vocab', completed: true },
        { id: 103, title: 'Mini-Story', duration: '25:10', type: 'story', completed: false },
        { id: 104, title: 'Point of View', duration: '08:15', type: 'pov', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Set 2: Bubba\'s Food',
      isOpen: false,
      lessons: [
        { id: 201, title: 'Main Audio Article', duration: '15:00', type: 'audio', completed: false },
        { id: 202, title: 'Vocabulary Lesson', duration: '20:30', type: 'vocab', completed: false },
        { id: 203, title: 'Mini-Story', duration: '22:45', type: 'story', completed: false },
        { id: 204, title: 'Point of View', duration: '10:00', type: 'pov', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Set 3: Dragnet',
      isOpen: false,
      lessons: [
        { id: 301, title: 'Main Audio Article', duration: '14:20', type: 'audio', completed: false },
        { id: 302, title: 'Vocabulary Lesson', duration: '19:15', type: 'vocab', completed: false },
        { id: 303, title: 'Mini-Story', duration: '24:00', type: 'story', completed: false }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Lấy ID từ URL
    this.courseId = this.route.snapshot.paramMap.get('id');
  }

  toggleAccordion(set: LessonSet) {
    set.isOpen = !set.isOpen;
  }

  getIconForType(type: string): string {
    switch(type) {
      case 'audio': return '🎧';
      case 'vocab': return '🧠';
      case 'story': return '⚡';
      case 'pov': return '🔄';
      default: return '📄';
    }
  }
}
