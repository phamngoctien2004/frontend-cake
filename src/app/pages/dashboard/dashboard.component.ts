import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { UserComponent } from "../user/user.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, UserComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
