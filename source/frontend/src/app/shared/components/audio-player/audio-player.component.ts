import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioState } from '../../../services/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  state: AudioState = {
    lesson: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: 1
  };
  showSpeedMenu = false;
  previousVolume = 1;
  private sub!: Subscription;

  constructor(
    public audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.audioService.state$.subscribe(state => {
      this.state = state;
      // Ép Angular render lại view ngay lập tức, khắc phục triệt để lỗi không hiện UI
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  togglePlay() {
    this.audioService.togglePlay();
  }

  skip(seconds: number) {
    this.audioService.skip(seconds);
  }

  setSpeed(rate: number) {
    this.audioService.setPlaybackRate(rate);
    this.showSpeedMenu = false;
  }

  onSeek(event: any) {
    const value = event.target.value;
    this.audioService.seek(value);
  }

  onVolumeChange(event: any) {
    const value = parseFloat(event.target.value);
    this.audioService.setVolume(value);
  }

  toggleMute() {
    if (this.state.volume > 0) {
      this.previousVolume = this.state.volume;
      this.audioService.setVolume(0);
    } else {
      this.audioService.setVolume(this.previousVolume || 1);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
