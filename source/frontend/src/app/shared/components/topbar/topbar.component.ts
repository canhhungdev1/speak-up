import { Component, OnInit, Inject, PLATFORM_ID, HostListener, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  isDarkMode = false;
  currentLang = 'vi';
  showLangDropdown = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('preferredLang');
      if (savedLang) {
        this.currentLang = savedLang;
      }
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('sidebar-open');
    }
  }

  toggleLangDropdown() {
    this.showLangDropdown = !this.showLangDropdown;
  }

  selectLang(lang: string) {
    this.currentLang = lang;
    this.showLangDropdown = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferredLang', lang);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Tự động đóng dropdown khi click ra ngoài topbar
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showLangDropdown = false;
    }
  }
}
