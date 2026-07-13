import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../../services/course.service';
import { LessonSetService, LessonSet } from '../../../../services/lesson-set.service';
import { AudioService } from '../../../../services/audio.service';
import { AuthService } from '../../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-learner-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './learner-course-detail.component.html',
  styleUrls: ['./learner-course-detail.component.scss']
})
export class LearnerCourseDetailComponent implements OnInit, OnDestroy {
  courseId: string = '';
  course: any = null;
  lessonSets: LessonSet[] = [];
  
  viewMode: 'basic' | 'game' = 'game';
  currentUser: any = null;
  currentActiveIndex: number = 1; // Giả lập bộ số 2 đang học, số 1 đã xong, còn lại bị khóa
  
  // Nâng cấp Bản đồ Game (Game View Enhancement)
  showCelebrationModal: boolean = false;
  toastMessage: string | null = null;
  confettiParticles: any[] = [];
  avatarLoadError: boolean = false;
  
  private userSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonSetService: LessonSetService,
    private audioService: AudioService,
    private authService: AuthService,
    private elRef: ElementRef
  ) {
    // Đọc chế độ hiển thị đã lưu từ bộ nhớ trình duyệt
    const savedMode = localStorage.getItem('course_view_mode');
    if (savedMode === 'basic' || savedMode === 'game') {
      this.viewMode = savedMode;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = params['id'];
        this.loadData();
      }
    });

    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.avatarLoadError = false;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  loadData() {
    // Tải thông tin khóa học
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.course = course;
    });
    
    // Tải danh sách bộ bài học
    this.lessonSetService.getLessonSetsByCourse(this.courseId).subscribe(sets => {
      this.lessonSets = sets;
      
      // Giả lập mức mở khóa bài học thực tế cho kiểm thử:
      // Set 1 (index 0): completed
      // Set 2 (index 1): active
      // Set 3 trở đi: locked
      // Nếu chỉ có 1 set: đặt index 0 làm active
      if (this.lessonSets.length === 1) {
        this.currentActiveIndex = 0;
      } else {
        this.currentActiveIndex = 1; 
      }

      // Tự động cuộn đến node active khi vào chế độ game
      if (this.viewMode === 'game') {
        setTimeout(() => this.scrollToActiveNode(), 300);
      }
    });
  }

  setViewMode(mode: 'basic' | 'game') {
    this.viewMode = mode;
    localStorage.setItem('course_view_mode', mode);
    if (mode === 'game') {
      setTimeout(() => this.scrollToActiveNode(), 150);
    }
  }

  goToSet(setId: string, isLocked: boolean) {
    if (isLocked) return;
    this.router.navigate(['/dashboard/sets', setId]);
  }

  // Thuật toán tính toán tọa độ x, y uốn lượn hình sin chạy dọc từ trên xuống dưới
  getNodeCoordinates(index: number, total: number) {
    if (total === 0) return { x: 50, y: 50 };
    if (index === -1) return { x: 50, y: 6 }; // Điểm Start nằm ở chính giữa sát mép trên

    // y phân bố dọc đều từ 10% (trên cùng) xuống 90% (dưới cùng)
    const stepY = 80 / (total + 1);
    const y = 8 + ((index + 1) * stepY);

    // x uốn lượn hình sin quanh trục 50%
    const amplitude = 18; // Biên độ uốn lượn 18%
    const frequency = 1.0; // Tần số góc uốn khúc
    const x = 50 + amplitude * Math.sin(index * frequency);

    return { x, y };
  }

  // Tự động sinh chuỗi Path SVG nối mượt mà tất cả các điểm tọa độ hình sin
  getRoadPath(): string {
    if (this.lessonSets.length === 0) return '';
    
    // Bao gồm điểm Bắt đầu (-1), các điểm bài học và điểm Đích đến cuối cùng (Finish Line)
    const points = [];
    for (let i = -1; i <= this.lessonSets.length; i++) {
      points.push(this.getNodeCoordinates(i, this.lessonSets.length));
    }

    let pathStr = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Điểm giữa để làm điểm kiểm soát cho đường cong mềm mại
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      pathStr += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
    // Nối đến điểm đích
    const last = points[points.length - 1];
    pathStr += ` L ${last.x} ${last.y}`;
    
    return pathStr;
  }

  // Lấy chữ cái viết tắt của tên người dùng
  getUserInitial(): string {
    if (this.currentUser) {
      const name = this.currentUser.name || this.currentUser.fullName || 'Student';
      return name.charAt(0).toUpperCase();
    }
    return 'U';
  }

  // Tự động cuộn mượt mà đến node bài học active hiện tại
  scrollToActiveNode() {
    try {
      const container = this.elRef.nativeElement.querySelector('.roadmap-scroll-container');
      const activeNode = this.elRef.nativeElement.querySelector('.candy-node.active');
      if (container && activeNode) {
        const containerHeight = container.clientHeight;
        const nodeTop = activeNode.offsetTop;
        const nodeHeight = activeNode.clientHeight;
        
        container.scrollTo({
          top: nodeTop - (containerHeight / 2) + (nodeHeight / 2),
          behavior: 'smooth'
        });
      }
    } catch (e) {
      console.warn('Scroll to active node failed:', e);
    }
  }

  // Kiểm tra xem khóa học đã được học hết chưa
  isCourseCompleted(): boolean {
    return this.lessonSets.length > 0 && this.currentActiveIndex >= this.lessonSets.length;
  }

  // Xử lý khi bấm nút Đích đến
  onFinishClick() {
    if (this.isCourseCompleted()) {
      this.showCelebrationModal = true;
      this.generateConfetti();
    } else {
      this.showToast('Hãy chinh phục tất cả các chặng để mở khóa Đích đến nhé! 🍬');
    }
  }

  // Hiển thị Toast thông báo nhanh
  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 3000);
  }

  // Sinh các mảnh pháo hoa confetti ngẫu nhiên
  generateConfetti() {
    this.confettiParticles = [];
    const colors = ['#f472b6', '#3b82f6', '#facc15', '#10b981', '#a855f7', '#f97316'];
    
    for (let i = 0; i < 75; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 2.2;
      const size = 6 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      this.confettiParticles.push({
        left: left,
        delay: delay,
        size: size,
        color: color
      });
    }

    // Tự động dọn dẹp sau 4.5 giây để tránh lag
    setTimeout(() => {
      this.confettiParticles = [];
    }, 4500);
  }

  closeCelebrationModal() {
    this.showCelebrationModal = false;
  }

  finishCourse() {
    this.showCelebrationModal = false;
    this.router.navigate(['/dashboard/courses']);
  }

  onAvatarError() {
    this.avatarLoadError = true;
  }
}
