import { Component, SimpleChanges } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-user',
  imports: [PaginationComponent, LoadingComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  data: UserDTO[];
  loading = true;
  constructor(private userService: UserService){
    this.data = [];
  }

  ngOnInit(): void{
    this.userService.get().subscribe({
      next: (users) => {
        this.data = users;
      },
      error: (error) => {
        console.error('Có lỗi xảy ra', error);
      },
      complete: () => {
        this.loading = false;
      }
    })
  } 

}
