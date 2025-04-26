import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { loginDto } from '../../dto/login.dto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-send-email',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
    model: loginDto;

    constructor(){
      this.model = new loginDto({});
    }
    
    onSendEmail(form: NgForm){

    }
}
