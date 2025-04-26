import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../constants/global.constants';
import { loginDto } from '../dto/login.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `${API_CONFIG.BASE_URL}`
  private currentUser = {}; 

  private currentUserSubject = new BehaviorSubject<any | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient) {}

  isAdmin(): boolean{
    return this.hasRole('admin')
  }
  hasRole(roleCheck: string):boolean{
    const user = this.getCurrentUser();
    return user.role === roleCheck;
  }
  getCurrentUser(): any{
    return this.currentUserSubject.value;
  }
  setCurrentUser(user: any): void{
    this.currentUserSubject.next(user);
  }
  setToken(token: string){
    localStorage.setItem('token', token);
  }
  getToken(): string | null{
    return localStorage.getItem('token');
  }

  login(loginDto: loginDto){
    return this.http.post<any>(this.url + `${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      email: loginDto.email,
      password: loginDto.password
    }).pipe(
      tap(response => {
        this.setToken(response.data.access_token);
        this.setCurrentUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      })
    );
  }

  register(loginDto: loginDto): Observable<any>{
    return this.http.post<any>(this.url + `${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
      name: loginDto.name,
      email: loginDto.email,
      password: loginDto.password,
      password_confirmation: loginDto.password_confirmation
    });
  }

  logout(): Observable<any>{
    return this.http.post<any>(this.url + `${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,{}).pipe(
      tap(response => {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser');
        console.log('auth')
      })
    );
  }
  
}
