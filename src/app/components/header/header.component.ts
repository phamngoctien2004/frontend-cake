import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  user: any;
  constructor(private authService: AuthService){
    this.user = this.authService.getCurrentUser();
  }

  logout(){
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('next');
        window.location.reload();
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
    });
  }

  onToggleClick() {
    this.toggleSidebar.emit();
  }

}
