// src/app/services/booking-management.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviornments/environment';

export interface Customer {
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
    date_of_birth: string | null;
    emergency_contact: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    created_at: string;
    updated_at: string;
  };
}

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
    date_of_birth: string | null;
    emergency_contact: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    created_at: string;
    updated_at: string;
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
  service_detail: Service;
  assign_cleaner: number | null;
  assign_cleaner_detail: any | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  special_requirements: string;
  payment_has_done: boolean;
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  booking_date: string;
  time_slot: string;
  service: number;
  special_requirements?: string;
  customer: number;
  location: string;
}

export interface UpdateBookingRequest {
  booking_date?: string;
  time_slot?: string;
  service?: number;
  special_requirements?: string;
  customer?: number;
  location?: string;
}

export interface BookingListResponse {
  code: number;
  message: string;
  data: Booking[];
}

export interface BookingResponse {
  code: number;
  message: string;
  data: Booking;
}

export interface CustomerListResponse {
  code: number;
  message: string;
  data: Customer[];
}

export interface CleanerListResponse {
  code: number;
  message: string;
  data: Cleaner[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingManagementService {
  private baseURL = `${environment.baseURL}/super-admin/api/cleaning-bookings`;
  private customerURL = `${environment.baseURL}/customer/api/list-customers`;
  private cleanerURL = `${environment.baseURL}/cleaner/api/list-cleaners`; // Updated cleaner API endpoint
  private http = inject(HttpClient);

  // Get all bookings
  getBookings(): Observable<BookingListResponse> {
    return this.http.get<BookingListResponse>(`${this.baseURL}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get booking by ID
  getBookingById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.baseURL}/${id}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Create new booking
  createBooking(bookingData: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseURL}/`, bookingData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Update booking by ID
  updateBooking(id: number, bookingData: UpdateBookingRequest): Observable<BookingResponse> {
    return this.http.patch<BookingResponse>(`${this.baseURL}/${id}/`, bookingData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Delete booking by ID
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get all customers
  getCustomers(): Observable<CustomerListResponse> {
    return this.http.get<CustomerListResponse>(`${this.customerURL}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get all cleaners - Updated endpoint
  getCleaners(): Observable<CleanerListResponse> {
    return this.http.get<CleanerListResponse>(`${this.cleanerURL}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Format date for API (YYYY-MM-DD)
  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Format time for API (HH:MM:SS)
  formatTimeForAPI(time: string): string {
    // Convert "10:00 AM" to "10:00:00"
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = (parseInt(hours) + 12).toString();
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  }

  // Parse API time to display format
  parseTimeFromAPI(time: string): string {
    // Convert "10:00:00" to "10:00 AM"
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const modifier = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${modifier}`;
  }

  // Handle API errors
  private handleError(error: any) {
    console.error('Booking API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid booking data. Please check your input.';
    } else if (error.status === 401) {
      errorMessage = 'Authentication failed. Please login again.';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error
    }));
  }
}