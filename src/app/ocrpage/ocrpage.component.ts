import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

interface Result {
  text: string;
  index: number;
}

interface Particle {
  style: {
    width: string;
    height: string;
    left: string;
    top: string;
    'animation-duration': string;
    'animation-delay': string;
  }
}

@Component({
  selector: 'app-ocrpage',
  templateUrl: './ocrpage.component.html',
  styleUrls: ['./ocrpage.component.css']
})
export class OcrpageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  text1: string = "";
  text2: string = "";
  text3: string = "";
  isfetch: boolean = false;
  isLoading: boolean = false;
  ocrForm: FormGroup;
  selectedFile: File | null = null;
  particles: Particle[] = [];
  persianNumbers = ['اول', 'دوم', 'سوم'];
  selectedLanguages: string[] = []; // آرایه برای نگهداری زبان‌های انتخاب شده
  
  get results(): Result[] {
    return [
      { text: this.text1, index: 0 },
      { text: this.text2, index: 1 },
      { text: this.text3, index: 2 }
    ].filter(result => result.text && result.text !== 'متن یافت نشد' && result.text !== 'Text not found');
  }

  constructor(private fb: FormBuilder) {
    this.ocrForm = this.fb.group({
      language: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.createParticles();
  }

  createParticles(): void {
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 20;
      
      this.particles.push({
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          'animation-duration': `${duration}s`,
          'animation-delay': `-${delay}s`
        }
      });
    }
  }

  // تغییر وضعیت چک‌باکس
  onLanguageToggle(event: Event, language: string): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    console.log('🎯 چک‌باکس تغییر کرد:', language, isChecked);
    
    if (isChecked) {
      // اضافه کردن زبان به لیست
      if (!this.selectedLanguages.includes(language)) {
        this.selectedLanguages.push(language);
      }
    } else {
      // حذف زبان از لیست
      this.selectedLanguages = this.selectedLanguages.filter(lang => lang !== language);
    }
    
    // آپدیت مقدار فرم (ارسال به صورت رشته جدا شده با کاما)
    this.ocrForm.patchValue({ 
      language: this.selectedLanguages.join(',') 
    });
    
    console.log('📝 زبان‌های انتخاب شده:', this.selectedLanguages);
    
    // نمایش پیام
    this.showSelectionToast();
  }

  // نمایش پیام انتخاب
  private showSelectionToast(): void {
    if (this.selectedLanguages.length === 0) {
      this.showToast('هیچ زبانی انتخاب نشده / No language selected');
    } else if (this.selectedLanguages.length === 1) {
      const langName = this.selectedLanguages[0] === 'fas' ? 'فارسی' : 'English';
      this.showToast(`زبان ${langName} انتخاب شد / ${langName} language selected`);
    } else {
      this.showToast('هر دو زبان انتخاب شدند / Both languages selected');
    }
  }

  // گرفتن متن زبان‌های انتخاب شده
  getSelectedLanguagesText(): string {
    const languages = this.selectedLanguages.map(lang => 
      lang === 'fas' ? 'فارسی' : 'English'
    );
    return languages.join(' و ');
  }

  // باز کردن dialog انتخاب فایل
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  private handleFileSelection(file: File): void {
    if (file) {
      // بررسی نوع فایل
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const isValidType = validTypes.includes(file.type) || 
                         ['jpg', 'jpeg', 'png'].includes(fileExtension || '');

      if (!isValidType) {
        this.showToast('لطفا یک فایل تصویری معتبر انتخاب کنید (JPG, PNG, JPEG) / Please select a valid image file (JPG, PNG, JPEG)');
        return;
      }
      
      // بررسی سایز فایل (حداکثر 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.showToast('حجم فایل باید کمتر از 10 مگابایت باشد / File size must be less than 10MB');
        return;
      }
      
      this.selectedFile = file;
      this.showToast('فایل با موفقیت انتخاب شد / File selected successfully');
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.showToast('فایل حذف شد / File removed');
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async onSubmit(): Promise<void> {
    this.isfetch = false;
    
    // علامت گذاری تمام فیلدها به عنوان touched
    this.ocrForm.markAllAsTouched();
    
    console.log('🚀 ارسال فرم:');
    console.log('زبان‌های انتخاب شده:', this.selectedLanguages);
    console.log('فایل انتخاب شده:', this.selectedFile?.name);
    
    if (this.selectedLanguages.length === 0) {
      this.showToast('لطفا حداقل یک زبان انتخاب کنید / Please select at least one language');
      return;
    }
    
    if (!this.selectedFile) {
      this.showToast('لطفا یک فایل تصویری انتخاب کنید / Please select an image file');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('language', this.selectedLanguages.join(',')); // ارسال به صورت جدا شده با کاما
    formData.append('file', this.selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });

      if (response.status === 200) {
        this.text1 = response.data['message']['text1'] || 'متن یافت نشد / Text not found';
        this.text2 = response.data['message']['text2'] || 'متن یافت نشد / Text not found';
        this.text3 = response.data['message']['text3'] || 'متن یافت نشد / Text not found';
        this.isfetch = true;
        
        this.showToast('استخراج متن با موفقیت انجام شد / Text extraction completed successfully');
        
        setTimeout(() => {
          const resultsSection = document.querySelector('.results-container-3d');
          if (resultsSection) {
            resultsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 500);
      } else {
        this.showToast('خطا در ارتباط با سرور / Server connection error');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === 'ECONNABORTED') {
        this.showToast('اتصال به سرور timeout خورد. لطفا دوباره تلاش کنید. / Server connection timeout. Please try again.');
      } else if (error.response) {
        this.showToast('خطای سرور: ' + error.response.status + ' / Server error: ' + error.response.status);
      } else {
        this.showToast('خطا در اتصال به سرور. لطفا دوباره تلاش کنید. / Error connecting to server. Please try again.');
      }
    } finally {
      this.isLoading = false;
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('متن با موفقیت کپی شد / Text copied successfully');
    }).catch(err => {
      console.error('خطا در کپی کردن متن: ', err);
      this.showToast('خطا در کپی کردن متن / Error copying text');
    });
  }

  private showToast(message: string): void {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #4ecdc4, #44a08d);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: inherit;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: toastSlideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}