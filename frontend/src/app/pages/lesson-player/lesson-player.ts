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
      word: 'big hitter', 
      type: 'idiom',
      meaning: 'someone who can hit a baseball very far (ie. a strong hitter)' 
    },
    { 
      word: 'to try out (for)', 
      type: 'verb',
      meaning: 'to try to get a job (usually used in sports or other performance jobs)' 
    },
    { 
      word: 'direct flight', 
      type: 'noun',
      meaning: 'a flight with no stops, (an airplane trip with no stops)' 
    },
    { 
      word: 'to reject', 
      type: 'verb',
      meaning: 'to say "no" to, to refuse' 
    },
    { 
      word: '"come on"', 
      type: 'idiom',
      meaning: '"hurry", "do [something] now" -- (always used as a command)' 
    },
    { 
      word: 'get a grip', 
      type: 'idiom',
      meaning: 'control your emotions, calm down (be calm), control yourself' 
    },
    { 
      word: 'to find out', 
      type: 'verb',
      meaning: 'to learn, to discover (new information)' 
    },
    { 
      word: 'impressed with', 
      type: 'adj',
      meaning: 'think (someone/something) is great' 
    },
    { 
      word: 'hitter', 
      type: 'noun',
      meaning: 'a person who hits' 
    },
    { 
      word: 'to hire', 
      type: 'verb',
      meaning: 'to give a job (to someone)' 
    },
    { 
      word: 'home run', 
      type: 'noun/idiom',
      meaning: 'the biggest hit in baseball, (idiom) a very big success' 
    },
    { 
      word: 'a raise', 
      type: 'noun',
      meaning: 'a pay increase, an increase in money (for a job)' 
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
