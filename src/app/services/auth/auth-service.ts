
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
        console.log('Login Response:', response); // Debug log
        if (response.user && response.user.access_token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('access_token', response.user.access_token);
          localStorage.setItem('refresh_token', response.user.refresh_token);
          this.currentUserSubject.next(response.user);

          console.log('User Role:', response.user.role); // Debug log
          console.log('Redirecting to:', this.getRedirectPath(response.user.role)); // Debug log
          
          // Redirect based on role after login
          this.redirectBasedOnRole(response.user.role);
        }
      })
    );
}

private redirectBasedOnRole(role: string): void {
  console.log('Redirecting user with role:', role);
  
  const redirectPath = this.getRedirectPath(role);
  console.log('Navigation path:', redirectPath);
  
  // Add more detailed debugging
  console.log('Current router config:', this.router.config);
  
  this.router.navigate([redirectPath]).then(navigationResult => {
    console.log('Navigation result:', navigationResult);
    if (!navigationResult) {
      console.error('Navigation failed to:', redirectPath);
      console.error('Available routes:', this.router.config);
      // Try alternative navigation approach
      this.alternativeNavigation(role);
    }
  }).catch(error => {
    console.error('Navigation error:', error);
    this.alternativeNavigation(role);
  });
}

private alternativeNavigation(role: string): void {
  console.log('Trying alternative navigation for role:', role);
  
  // Try different navigation approaches
  switch (role) {
    case 'admin':
      window.location.href = '/admin/dashboard';
      break;
    case 'cleaner':
      window.location.href = '/cleaner/dashboard';
      break;
    case 'customer':
      window.location.href = '/customer/dashboard';
      break;
    default:
      window.location.href = '/sign-in';
  }
}

private getRedirectPath(role: string): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'cleaner': return '/cleaner/dashboard';
    case 'customer': return '/customer/dashboard';
    default: return '/sign-in';
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