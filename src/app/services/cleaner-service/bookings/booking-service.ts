import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface CleanerBooking {
  payout_id: number | null;
  cleaner_name: string;
  payment_method: string | null;
  amount: number | null;
  status: string;
  action: any[];
  booking_id: number;
  service_name: string;
  booking_date: string;
  time_slot: string;
}

export interface BookingStatusUpdate {
  status: 'accepted' | 'completed' | 'cancelled' | 'rejected';
}

export interface BookingDetail {
  id: number;
  customer: number;
  customer_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  customer_name: string;
  location: string;
  booking_date: string;
  time_slot: string;
  service: number;
  service_detail: {
    id: number;
    name: string;
    price_per_hour: string;
    platform_fee_per_hour: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  assign_cleaner: number;
  assign_cleaner_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: string;
  special_requirements: string;
  payment_has_done: boolean;
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all bookings for cleaner
  getCleanerBookings(): Observable<ApiResponse<CleanerBooking[]>> {
    return this.http.get<ApiResponse<CleanerBooking[]>>(
      `${this.baseURL}/cleaner/api/booking-management/`,
      { headers: this.getHeaders() }
    );
  }

  // Update booking status
  updateBookingStatus(bookingId: number, status: BookingStatusUpdate): Observable<ApiResponse<BookingDetail>> {
    return this.http.post<ApiResponse<BookingDetail>>(
      `${this.baseURL}/cleaner/api/bookings/${bookingId}/update-status/`,
      status,
      { headers: this.getHeaders() }
    );
  }

  // Get booking details by ID
  getBookingDetails(bookingId: number): Observable<ApiResponse<BookingDetail>> {
    return this.http.get<ApiResponse<BookingDetail>>(
      `${this.baseURL}/cleaner/api/bookings/${bookingId}/`,
      { headers: this.getHeaders() }
    );
  }
}