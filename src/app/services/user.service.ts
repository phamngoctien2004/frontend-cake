import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../constants/global.constants';
import { UserDTO } from '../dto/user.dto';
import { Observable, map } from 'rxjs';
import { loginDto } from '../dto/login.dto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${API_CONFIG.BASE_URL}`
  
  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzQ1NTgxMTY1LCJleHAiOjE3NDU1ODgzNjUsIm5iZiI6MTc0NTU4MTE2NSwianRpIjoiRG03ZjBxYWJmbEVPd01UcSIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.jQnEtoG_A_cS3Fzy6R4LLNwmpgJv-X_TsCnngzMhVQ8';
    
  constructor(private http: HttpClient) { }


  get(): Observable<UserDTO[]>{
    let result: UserDTO[] = [];
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    // pipe đón response và trả về kết quả cho next
    return this.http.get<any>(this.url + `${API_CONFIG.ENDPOINTS.USERS.BASE}`, {headers}).pipe(
      map(response => {
        const data: any[] = response.data.data;
        return this.toListUserDTO(data);
      })
    )
  }

  toListUserDTO(data: any[]){
    return data.map(user => new UserDTO(user))
  }

  login(loginDto: loginDto){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.url + `${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      email: loginDto.email,
      password: loginDto.password
    },{headers});
  }

  register(loginDto: loginDto): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.url + `${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
      name: loginDto.name,
      email: loginDto.email,
      password: loginDto.password,
      password_confirmation: loginDto.password_confirmation
    },{headers});
  }
}
