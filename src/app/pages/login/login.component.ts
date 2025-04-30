import { Component, ViewChild, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { loginDto } from '../../dto/login.dto';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../components/loading/loading.component";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

// Declare global type for window to use grecaptcha
declare global {
  interface Window {
    grecaptcha: any;
    onloadCallback: any;
  }
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, LoadingComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('login') loginForm: any;
    model: loginDto;
    modelRegister: loginDto;
    message;
    activeTab = "login";
    loading = false;
    captchaError = false;
    
    // Site key for reCAPTCHA v2 Checkbox
    siteKey = '6LfweSkrAAAAAIY0vALyQjfGCMHAsHLyKE27oEXz';
    
    // Store reCAPTCHA widget IDs
    loginCaptchaId: number | null = null;
    registerCaptchaId: number | null = null;

    constructor(
      private authService: AuthService, 
      private router: Router,
      private zone: NgZone,
      private cdr: ChangeDetectorRef
    ){
      this.model = new loginDto({});
      this.modelRegister = new loginDto({});
      this.message = {
        status: false,
        message: '',
        clicked: false,
      }
    }

    ngOnInit() {
      // Define global callback for reCAPTCHA to call when loaded
      window.onloadCallback = () => {
        this.zone.run(() => {
          console.log('reCAPTCHA loaded and ready to render');
          this.renderCaptchas();
        });
      };
      
      // Add reCAPTCHA script with onload callback
      this.loadRecaptchaScript();
    }
    
    ngAfterViewInit() {
      // Ensure reCAPTCHA is rendered after view is initialized
      setTimeout(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          this.renderCaptchas();
        }
      }, 1000);
    }

    // Load reCAPTCHA script with callback
    loadRecaptchaScript() {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (existingScript) {
        existingScript.remove(); // Remove old script if exists
      }
      
      // Create new script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      console.log('reCAPTCHA script added to page');
    }

    // Render captcha widgets
    renderCaptchas() {
      try {
        if (!window.grecaptcha || !window.grecaptcha.render) {
          console.error('grecaptcha is not loaded yet');
          return;
        }

        const loginCaptchaElement = document.getElementById('login-captcha');
        const registerCaptchaElement = document.getElementById('register-captcha');
        
        if (this.activeTab === 'login' && loginCaptchaElement) {
          // Check if widget has already been rendered
          if (loginCaptchaElement.childNodes.length === 0) {
            console.log('Rendering login captcha');
            try {
              this.loginCaptchaId = window.grecaptcha.render('login-captcha', {
                'sitekey': this.siteKey,
                'callback': (response: string) => {
                  this.zone.run(() => {
                    this.model.captcha = response;
                    console.log('Captcha resolved for login');
                  });
                }
              });
            } catch (e) {
              if (!(e instanceof Error) || !e.toString().includes('already been rendered')) {
                console.error('Error rendering login captcha:', e);
              }
            }
          }
        } else if (this.activeTab === 'register' && registerCaptchaElement) {
          // Check if widget has already been rendered
          if (registerCaptchaElement.childNodes.length === 0) {
            console.log('Rendering register captcha');
            try {
              this.registerCaptchaId = window.grecaptcha.render('register-captcha', {
                'sitekey': this.siteKey,
                'callback': (response: string) => {
                  this.zone.run(() => {
                    this.modelRegister.captcha = response;
                    console.log('Captcha resolved for register');
                  });
                }
              });
            } catch (e) {
              if (!(e instanceof Error) || !e.toString().includes('already been rendered')) {
                console.error('Error rendering register captcha:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in renderCaptchas:', error);
      }
    }

    // Reset captcha for current tab
    resetCaptcha() {
      try {
        if (window.grecaptcha) {
          if (this.activeTab === 'login' && this.loginCaptchaId !== null) {
            window.grecaptcha.reset(this.loginCaptchaId);
            this.model.captcha = '';
          } else if (this.activeTab === 'register' && this.registerCaptchaId !== null) {
            window.grecaptcha.reset(this.registerCaptchaId);
            this.modelRegister.captcha = '';
          }
        }
      } catch (error) {
        console.error('Error resetting captcha:', error);
      }
    }
    onLogin(form: NgForm){
      this.captchaError = false;
      
      if(form.valid){
        // Check captcha
        if(!this.model.captcha){
          this.captchaError = true;
          this.message.status = true;
          this.message.message = 'Vui lòng xác nhận bạn không phải là robot';
          return;
        }
        
        // Continue with form submission
        this.loading = true;
        this.authService.login(this.model).subscribe({
          next: (response) => {
            const data = response.data;
            this.message.clicked = true;
            this.message.status = false;
            this.message.message = "Đăng nhập thành công";
            console.log(response);

            if(data.user.role === 'admin'){
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/']);
            }
          },
          error: (errorResponse) => {
            this.loading = false;
            
            // Log lỗi đầy đủ để debug
            console.error('Login error:', errorResponse);
            
            try {
              // Kiểm tra cấu trúc lỗi
              if (errorResponse.error && errorResponse.error.errors) {
                const errors = errorResponse.error.errors;
                
                // Kiểm tra từng loại lỗi phổ biến
                if (errors.email && errors.email.length > 0) {
                  this.message.message = errors.email[0];
                } else if (errors.password && errors.password.length > 0) {
                  this.message.message = errors.password[0];
                } else if (errors.captcha && errors.captcha.length > 0) {
                  this.message.message = errors.captcha[0];
                } else {
                  // Nếu không tìm thấy lỗi cụ thể
                  this.message.message = 'Đăng nhập thất bại';
                }
              } else if (errorResponse.status === 401) {
                // Lỗi unauthorized
                this.message.message = 'Email hoặc mật khẩu không chính xác';
              } else if (errorResponse.status === 422) {
                // Lỗi validation
                this.message.message = 'Dữ liệu không hợp lệ';
              } else {
                // Các lỗi khác
                this.message.message = 'Đăng nhập thất bại, vui lòng thử lại';
              }
            } catch (e) {
              // Xử lý ngoại lệ khi parse error
              console.error('Error parsing error response:', e);
              this.message.message = 'Đã có lỗi xảy ra, vui lòng thử lại';
            }
            
            this.message.status = true;
            
            // Reset reCAPTCHA on error
            this.resetCaptcha();
          }
        });
      }
    }
    onRegister(form: NgForm){
      this.captchaError = false;
      
      if(form.valid && this.passwordMatching()){
        // Check captcha
        if(!this.modelRegister.captcha){
          this.captchaError = true;
          this.message.status = true;
          this.message.message = 'Vui lòng xác nhận bạn không phải là robot';
          return;
        }
        
        // Continue with form submission
        this.loading = true;
        this.authService.register(this.modelRegister).subscribe({
          next: (response) => {
            console.log(response.data);
            this.loading = false;
            this.message.clicked = true;
            this.message.status = false;
            this.message.message = "Đăng kí thành công vui lòng xác thực email";
          },
          error: (errorResponse) => {
            let errors = errorResponse.error.errors;
            this.message.status = true;
            this.message.message = errors?.email?.[0] || 'Đăng ký thất bại';
            this.loading = false;
            
            // Reset reCAPTCHA on error
            this.resetCaptcha();
          },
          complete: () => {
            setTimeout(()=>{
              this.switchTab('login')
            },4000)
          }
        });
      }
    }
    switchTab(tab: string){
      this.message.status = false;
      this.message.message = '';
      this.message.clicked = false;
      this.captchaError = false;
      this.activeTab = (tab === 'login' ? 'login': 'register');
      
      // Re-render captchas after switching tabs
      setTimeout(() => {
        this.renderCaptchas();
      }, 100);
      
      this.cdr.detectChanges();
    }
    passwordMatching(){      
      return this.modelRegister.password === this.modelRegister.password_confirmation;
    }
}
