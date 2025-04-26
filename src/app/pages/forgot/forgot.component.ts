import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loginDto } from '../../dto/login.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
    model: loginDto;
    message = {
        status: false,
    }
    constructor(private router: ActivatedRoute){
      this.model = new loginDto({
        token: this.router.snapshot.queryParams['token'],
        email: this.router.snapshot.queryParams['email']
      })
    }
    ngOnInit(){
      // this.router.queryParams.subscribe(params => {
      //   console.log(params);
      // })
    }

    onReset(form: NgForm){

    }

    passwordMatching(){      
      return this.model.password === this.model.password_confirmation;
    }
}
