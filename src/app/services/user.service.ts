import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../constants/global.constants';
import { UserDTO } from '../dto/user.dto';
import { Observable, map } from 'rxjs';
import { loginDto } from '../dto/login.dto';
import { AuthService } from './auth.service';
import { PaginationResponse } from '../dto/pagination.dto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${API_CONFIG.BASE_URL}`
      
  constructor(private http: HttpClient, private authService: AuthService) { }


  get(page?: number): Observable<PaginationResponse<UserDTO>>{
    let result: PaginationResponse<UserDTO> = {
      data: [],
      current_page: 0,
      last_page: 0
    }

    let params = new HttpParams();
    params = params.append('page',page || 1);
    console.log("param ", params);
    // pipe đón response và trả về kết quả cho next
    return this.http.get<any>(this.url + `${API_CONFIG.ENDPOINTS.USERS.BASE}`,{params: params}).pipe(
      map(response => {
        console.log(response)
        result.data = response.data;
        result.current_page = response.meta.current_page;
        result.last_page = response.meta.last_page;
        return result;
      })
    )
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`);
  }
  toListUserDTO(data: any[]){
    return data.map(user => new UserDTO(user))
  }
}
