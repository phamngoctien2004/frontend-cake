import { Component, Input, SimpleChanges } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { LoadingComponent } from '../../components/loading/loading.component';
import { PaginationResponse } from '../../dto/pagination.dto';

@Component({
  selector: 'app-user',
  imports: [PaginationComponent, LoadingComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users: PaginationResponse<UserDTO> = {
    data: [],
    current_page: 0,
    last_page: 0
  }
  disablePagination = false;
  loading = true;
  constructor(private userService: UserService){
  }

  ngOnInit(): void{
      this.loadUsers();
  } 
  ngOnChanges(): void{
    // this.loadUsers();
    console.log('123')
  }
  loadUsers(){
    let page = this.users.current_page;
    this.userService.get(page).subscribe({
      next: (response) => {
        this.users = response;
        
        console.log(this.users)
      },
      error: (error) => {
        console.error('Có lỗi xảy ra', error);
      },
      complete: () => {
        this.loading = false;
        this.disablePagination = false;
      }
    })
  }

  getCurrentPage(e: number){
    this.users.current_page = e;
    console.log(this.users.current_page)
    this.loadUsers();
    this.disablePagination = true;
  }
}
