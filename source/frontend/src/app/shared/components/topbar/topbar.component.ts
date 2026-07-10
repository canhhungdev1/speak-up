import { Component, OnInit, Inject, PLATFORM_ID, HostListener, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  isDarkMode = false;
  currentLang = 'en'; // Mặc định là English theo yêu cầu
  showLangDropdown = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private elementRef: ElementRef,
    private translate: TranslateService
  ) {
    // Thiết lập ngôn ngữ mặc định của ứng dụng
    this.translate.setDefaultLang('en');
  }

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

    // Áp dụng ngôn ngữ đang dùng
    this.translate.use(this.currentLang);
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
    this.translate.use(lang); // Thực hiện dịch động tức thì
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
