import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface PaymentMethod {
  id?: number;
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  is_active?: boolean;
  created_at?: string;
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
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Payment Methods APIs
  getPaymentMethods(): Observable<ApiResponse<PaymentMethod[]>> {
    return this.http.get<ApiResponse<PaymentMethod[]>>(
      `${this.baseURL}/customer/api/payment-methods/`,
      { headers: this.getHeaders() }
    );
  }

  createPaymentMethod(paymentMethod: PaymentMethod): Observable<any> {
    return this.http.post(
      `${this.baseURL}/customer/api/payment-methods/`,
      paymentMethod,
      { headers: this.getHeaders() }
    );
  }

  updatePaymentMethod(id: number, paymentMethod: PaymentMethod): Observable<ApiResponse<PaymentMethod>> {
    return this.http.put<ApiResponse<PaymentMethod>>(
      `${this.baseURL}/customer/api/update-payment/${id}/`,
      paymentMethod,
      { headers: this.getHeaders() }
    );
  }

  setDefaultPaymentMethod(id: number): Observable<any> {
    return this.http.post(
      `${this.baseURL}/customer/api/payment-methods/${id}/default/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseURL}/customer/api/payment-methods/${id}/`,
      { headers: this.getHeaders() }
    );
  }

  // Bookings API
  getBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(
      `${this.baseURL}/customer/api/bookings/`,
      { headers: this.getHeaders() }
    );
  }
}