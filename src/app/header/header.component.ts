import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface FloatingElement {
  style: {
    width: string;
    height: string;
    left: string;
    background: string;
    animationDelay: string;
    animationDuration: string;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // تغییر از scss به css
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  activeSection = 'home';
  floatingElements: FloatingElement[] = [];
  menuOpen = false;

  private scrollListener!: () => void;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initScrollListener();
    this.createFloatingElements();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 992) {
      this.isMenuOpen = false;
      this.menuOpen = false;
    }
  }

  private initScrollListener(): void {
    this.scrollListener = () => {
      this.isScrolled = window.scrollY > 50;
      this.updateActiveSection();
    };
    
    window.addEventListener('scroll', this.scrollListener);
  }

  private updateActiveSection(): void {
    const sections = ['home', 'features', 'services', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuOpen = this.isMenuOpen;
    
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  navigateToSection(section: string): void {
    this.activeSection = section;
    this.isMenuOpen = false;
    this.menuOpen = false;
    document.body.style.overflow = '';

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  navigateToOCR(): void {
    this.isMenuOpen = false;
    this.menuOpen = false;
    document.body.style.overflow = '';
    this.router.navigate(['/ocr']);
  }

  private createFloatingElements(): void {
    const colors = [
      'rgba(0, 123, 255, 0.1)',
      'rgba(102, 16, 242, 0.1)',
      'rgba(32, 201, 151, 0.1)',
      'rgba(220, 53, 69, 0.1)'
    ];

    for (let i = 0; i < 8; i++) {
      const size = Math.random() * 60 + 20;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 15;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.floatingElements.push({
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          background: color,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }
      });
    }
  }
}