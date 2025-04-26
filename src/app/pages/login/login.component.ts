import { Component, ViewChild, viewChild } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { loginDto } from '../../dto/login.dto';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, LoadingComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    @ViewChild('login') loginForm: any;
    model: loginDto;
    modelRegister: loginDto;
    message;
    activeTab = "login";
    loading = false;

    constructor(private authService: AuthService, private router: Router){
      this.model = new loginDto({});
      this.modelRegister = new loginDto({});
      this.message = {
        status: false,
        message: '',
        clicked: false,
      }
    }
    onLogin(form: NgForm){
      this.loading = true;
      console.log(this.model)
      debugger;
      if(form.submitted){
        this.authService.login(this.model).subscribe({
          next: (response) => {
            const data = response.data;
            this.message.clicked = true;
            this.message.status = false;
            this.message.message = "Đăng nhập thành công"
            console.log(response)
            this.router.navigate(['/dashboard']);
          },
          error: (errorResponse) => {
            let errors = errorResponse.error.errors;
            this.message.status = true;
            this.message.message = errors.email[0];  
            this.loading = false;
          }
        })
      }
    }
    onRegister(form: NgForm){
      this.loading = true;
      if(form.submitted){
        this.authService.register(this.modelRegister).subscribe({
          next: (response) => {
            console.log(response.data);
            this.loading = false;
            this.message.clicked = true;
            this.message.status = false;
            this.message.message = "Đăng kí thành công vui lòng xác thực email"
          },
          error: (errorResponse) => {
            let errors = errorResponse.error.errors;
            this.message.status = true;
            this.message.message = errors.email[0];  
            this.loading = false;
          },
          complete: () => {
            setTimeout(()=>{
              this.switchTab('login')
            },4000)
          }
          
        })

        console.log(this.modelRegister);
        
      }
    }
    switchTab(tab: string){
      this.message.status = false,
      this.message.message = '',
      this.message.clicked = false
      this.activeTab = (tab === 'login' ? 'login': 'register');
    }
    passwordMatching(){      
      return this.modelRegister.password === this.modelRegister.password_confirmation;
    }
}
