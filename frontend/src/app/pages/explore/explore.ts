import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore {
  // Mock data cho danh sách khóa học Effortless English
  allCourses = [
    { 
      id: 1, 
      title: 'Original English', 
      level: 'Beginner', 
      lessons: 30, 
      color: '#3b82f6',
      description: 'The classic foundation for learning to speak English automatically.'
    },
    { 
      id: 2, 
      title: 'Power English', 
      level: 'Advanced', 
      lessons: 30, 
      color: '#10b981',
      description: 'Learn psychology strategies for success while improving your English.'
    },
    { 
      id: 3, 
      title: 'Real English', 
      level: 'Advanced', 
      lessons: 25, 
      color: '#f59e0b',
      description: 'Understand native speakers talking at normal, fast speed.'
    },
    { 
      id: 4, 
      title: 'Pronunciation Course', 
      level: 'All Levels', 
      lessons: 15, 
      color: '#8b5cf6',
      description: 'Master the sounds of American English and speak clearly.'
    },
    { 
      id: 5, 
      title: 'Business English', 
      level: 'Intermediate', 
      lessons: 20, 
      color: '#6366f1',
      description: 'Learn vocabulary and phrases for the corporate environment.'
    },
    { 
      id: 6, 
      title: 'VIP Program', 
      level: 'Advanced', 
      lessons: 40, 
      color: '#ec4899',
      description: 'Exclusive advanced leadership and speaking training.'
    }
  ];

  selectedLevel: string = 'All';
  levels: string[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  get filteredCourses() {
    if (this.selectedLevel === 'All') return this.allCourses;
    return this.allCourses.filter(c => c.level === this.selectedLevel);
  }

  setFilter(level: string) {
    this.selectedLevel = level;
  }
}
