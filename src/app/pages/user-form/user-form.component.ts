import { Component } from '@angular/core';
import { LoadingComponent } from "../../components/loading/loading.component";
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserDTO } from '../../dto/user.dto';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [LoadingComponent, RouterLink, FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  isEditMode = false;
  state = {
    loading: false
  }
  model: UserDTO = new UserDTO({});
  formattedCreatedAt: string = '';
  formattedUpdatedAt: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(){
    this.route.params.subscribe(params => {
      if(params['id']){
        console.log("as")
        this.isEditMode = true;
        this.userService.getById(params['id']).subscribe({
          next: (response) => {
            this.model = response.data;
            console.log(response)
            this.formattedCreatedAt = this.userService.formatDateTime(new Date(response.data.created_at));
            this.formattedUpdatedAt = this.userService.formatDateTime(new Date(response.data.updated_at));
          }
        })
      }
    })
  }

  onEdit(form: NgForm){
    if(form.submitted){
      console.log("ok")
      console.log(form.value)
    }
  }

}
