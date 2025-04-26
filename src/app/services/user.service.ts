import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../constants/global.constants';
import { UserDTO } from '../dto/user.dto';
import { Observable, map } from 'rxjs';
import { loginDto } from '../dto/login.dto';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${API_CONFIG.BASE_URL}`
      
  constructor(private http: HttpClient, private authService: AuthService) { }


  get(): Observable<UserDTO[]>{
    let result: UserDTO[] = [];

    // pipe đón response và trả về kết quả cho next
    return this.http.get<any>(this.url + `${API_CONFIG.ENDPOINTS.USERS.BASE}`).pipe(
      map(response => {
        const data: any[] = response.data;
        console.log(response)
        return this.toListUserDTO(data);
      })
    )
  }

  toListUserDTO(data: any[]){
    return data.map(user => new UserDTO(user))
  }


}
