import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface Cleaner {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  profile: {
    id: number;
    phone_number: string;
    role: string;
    status: string;
    is_verified: boolean;
    dba_verification: boolean;
    rating: string;
    total_services_done: number;
    pending_services: number;
    on_hold_services: number;
    profile_picture: string | null;
    city: string;
    state: string;
    country: string;
  };
}

export interface Service {
  id: number;
  name: string;
  price_per_hour: string;
  platform_fee_per_hour: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  customer: number;
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
  };
  assign_cleaner: number | null;
  cleaner_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  special_requirements: string;
  payment_has_done: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  location: string;
  booking_date: string;
  time_slot: string;
  service: number;
  assign_cleaner: number | null;
  special_requirements: string;
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
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token'); // Adjust based on your auth storage
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Get all cleaners
  getAllCleaners(): Observable<ApiResponse<Cleaner[]>> {
    return this.http.get<ApiResponse<Cleaner[]>>(
      `${this.baseURL}/cleaner/api/list-cleaners/`,
      { headers: this.getHeaders() }
    );
  }

  // Get all services
  getAllServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(
      `${this.baseURL}/super-admin/api/services/`,
      { headers: this.getHeaders() }
    );
  }

  // Get all bookings
  getAllBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(
      `${this.baseURL}/customer/api/bookings/`,
      { headers: this.getHeaders() }
    );
  }

  // Get booking by ID
  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(
      `${this.baseURL}/customer/api/bookings/${id}/`,
      { headers: this.getHeaders() }
    );
  }

  // Create new booking
  createBooking(bookingData: BookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(
      `${this.baseURL}/customer/api/bookings/`,
      bookingData,
      { headers: this.getHeaders() }
    );
  }

  // Update booking
  updateBooking(id: number, bookingData: BookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(
      `${this.baseURL}/customer/api/bookings/${id}/`,
      bookingData,
      { headers: this.getHeaders() }
    );
  }
}