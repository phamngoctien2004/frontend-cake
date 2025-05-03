import { Component, Input, SimpleChanges } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { LoadingComponent } from '../../components/loading/loading.component';
import { PaginationResponse } from '../../dto/pagination.dto';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [PaginationComponent, LoadingComponent, RouterLink, ModalComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users: PaginationResponse<UserDTO> = {
    data: [],
    current_page: 1,
    last_page: 0
  }
  disablePagination = false;
  loading = true;
  showModal = false;
  selectedUser: UserDTO = new UserDTO({});
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
        this.users.data = this.userService.getUserByPage(page);
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

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Lỗi khi xóa người dùng:', error);
        }
      });
    }
  }
  getCurrentPage(e: number){
    this.users.current_page = e;
    this.users.data = this.userService.getUserByPage(e);
    console.log(this.users.current_page)
    // this.loadUsers();
    // this.disablePagination = true;
  }
  onDetail(id: number){
    this.selectedUser = this.userService.getUserInfo(id);
    this.showModal = true;
  }
  onClose(){
    this.showModal = false;
    console.log("12")
    this.selectedUser = new UserDTO({});
  }

}
