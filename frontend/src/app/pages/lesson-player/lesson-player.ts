import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lesson-player.html',
  styleUrl: './lesson-player.scss'
})
export class LessonPlayer {
  // Trạng thái chung
  lessonTitle = 'A Kiss';
  lessonType: 'audio' | 'vocab' | 'story' = 'story'; // Default to story
  isPlaying = false;
  progress = 30; // 30%

  // --- DỮ LIỆU MOCK THEO TỪNG CHẾ ĐỘ --- //

  // 1. Chế độ Main Audio
  showArticleText = true;
  articleText = `Carlos buys a new car. It's a very expensive car. It's a huge, blue, fast car. While driving down the street, Carlos sees a girl on a bicycle. She has long blond hair and is beautiful.
  
He yells to her, "What's up?"
She ignores him.

He yells, "How's it going?"
She keeps going and ignores him.

He yells, "Hey, why won't you talk to me? I want to go to dinner with you. I'll take you to an expensive restaurant."
The girl turns, gets off the bike, and looks at him.`;

  // 2. Chế độ Vocabulary
  vocabList = [
    { 
      word: 'Expensive', 
      phonetic: '/ɪkˈspensɪv/', 
      meaning: 'Costing a lot of money.', 
      example: 'It was a very expensive car.' 
    },
    { 
      word: 'Huge', 
      phonetic: '/hjuːdʒ/', 
      meaning: 'Extremely large.', 
      example: 'It was a huge, blue, fast car.' 
    },
    { 
      word: 'Ignore', 
      phonetic: '/ɪɡˈnɔːr/', 
      meaning: 'To pay no attention to something or someone.', 
      example: 'She ignores him and keeps going.' 
    }
  ];

  // 3. Chế độ Mini-Story (Karaoke)
  transcript = [
    { time: '0:00', text: 'Hello, this is A.J. Hoge. Welcome to the mini-story for "A Kiss".', isActive: false },
    { time: '0:05', text: 'Carlos bought a new car.', isActive: false },
    { time: '0:08', text: 'It was a very expensive car.', isActive: false },
    { time: '0:12', text: 'It was a huge, blue, fast car.', isActive: true }, // Dòng đang đọc
    { time: '0:16', text: 'While driving down the street, Carlos saw a girl on a bicycle.', isActive: false },
    { time: '0:22', text: 'She had long blond hair and was beautiful.', isActive: false },
    { time: '0:26', text: 'He yelled to her, "What\'s up?"', isActive: false },
    { time: '0:30', text: 'She ignored him.', isActive: false }
  ];

  // --- HÀM TƯƠNG TÁC --- //

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  toggleArticleText() {
    this.showArticleText = !this.showArticleText;
  }

  setLessonType(type: 'audio' | 'vocab' | 'story') {
    this.lessonType = type;
  }
}
