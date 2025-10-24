import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface DashboardStats {
  statistics: {
    total_cleanings: number;
    pending_payments: number;
    upcoming_cleanings: number;
    todays_cleanings: number;
  };
  upcoming_cleanings: UpcomingCleaning[];
}

export interface UpcomingCleaning {
  id: number;
  booking_date: string;
  time_slot: string;
  location: string;
  service_name: string;
  service_price: number;
  platform_fee: number;
  total_amount: number;
  cleaner_name: string;
  cleaner_email: string;
  status: string;
  special_requirements: string;
  payment_has_done: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(
      `${this.baseURL}/customer/api/customer/dashboard/`,
      { headers: this.getHeaders() }
    );
  }
}