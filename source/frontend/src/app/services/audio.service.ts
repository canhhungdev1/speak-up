import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lesson } from './lesson.service';

export interface AudioState {
  lesson: Lesson | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();

  private stateSubject = new BehaviorSubject<AudioState>({
    lesson: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
  });

  public state$ = this.stateSubject.asObservable();

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ currentTime: this.audio.currentTime });
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateState({ duration: this.audio.duration });
    });

    this.audio.addEventListener('play', () => this.updateState({ isPlaying: true }));
    this.audio.addEventListener('pause', () => this.updateState({ isPlaying: false }));
    this.audio.addEventListener('ended', () => this.updateState({ isPlaying: false }));
  }

  private updateState(newState: Partial<AudioState>) {
    this.stateSubject.next({ ...this.stateSubject.value, ...newState });
  }

  loadLesson(lesson: Lesson) {
    
    const currentState = this.stateSubject.value;
    if (currentState.lesson?.id !== lesson.id) {
      this.audio.src = lesson.audioUrl;
      this.audio.load();
      this.updateState({ lesson, currentTime: 0, duration: 0 });
    }
  }

  clear() {
    this.audio.pause();
    this.audio.src = '';
    this.updateState({ lesson: null, isPlaying: false, currentTime: 0, duration: 0 });
  }

  playLesson(lesson: Lesson) {
    this.loadLesson(lesson);
    this.audio.play().catch(e => console.log('Autoplay blocked:', e));
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  skip(seconds: number) {
    this.audio.currentTime += seconds;
  }

  setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
    this.updateState({ playbackRate: rate });
  }
}
