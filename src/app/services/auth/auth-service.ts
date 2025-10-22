
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../enviornments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  phone_number: string;
  role: string;
  status: string;
  is_verified: boolean;
  dba_verification: boolean;
  rating: string;
  total_services_done: number;
  pending_services: number;
  on_hold_services: number;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = environment.baseURL;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseURL}/auths/api/login/`, credentials)
      .pipe(
        tap(response => {
          if (response.user && response.user.access_token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('access_token', response.user.access_token);
            localStorage.setItem('refresh_token', response.user.refresh_token);
            this.currentUserSubject.next(response.user);

            // Redirect based on role after login
            this.redirectBasedOnRole(response.user.role);
          }
        })
      );
  }

private redirectBasedOnRole(role: string): void {
  switch (role) {
    case 'admin':
      this.router.navigate(['/admin/dashboard']);
      break;
    case 'cleaner':
      this.router.navigate(['/dashboard']); // Cleaner uses root path
      break;
    case 'customer':
      this.router.navigate(['/customer/dashboard']);
      break;
    default:
      this.router.navigate(['/dashboard']);
  }
}

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/sign-in']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getApiUrl(endpoint: string): string {
    return `${this.baseURL}/${endpoint}`;
  }
}