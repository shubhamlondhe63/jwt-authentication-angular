import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://your-api-url/auth';
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
  }

  private getUserFromLocalStorage() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return user && user.token;
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwt_decode(token);
      if (!decoded.exp) return null;
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);
      return expirationDate;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  
  

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.currentUserValue?.token;
    if (!token) return true;
    const date = this.getTokenExpirationDate(token);
    if (date === null) return false;
    return date.valueOf() < new Date().valueOf();
  }
}
