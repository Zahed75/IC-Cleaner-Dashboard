import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface Payout {
  id: number;
  cleaner: number;
  booking: number | null;
  payment_method: number;
  amount: string;
  status: string;
  payout_type: string;
  notes: string;
  available_balance: number;
  can_request_payout: boolean;
  cleaner_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  booking_detail: any | null;
  payment_method_detail: {
    id: number;
    method: string;
    paypal_email: string;
    beneficiary_name: string;
    bank_name: string;
    bank_address: string;
    account_number: string;
    sort_code: string;
    iban: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
  };
  disputes_total: number;
  disputes_pending: number;
  disputes_resolved: number;
  disputes_high_priority: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  method: string;
  paypal_email: string;
  beneficiary_name: string;
  bank_name: string;
  bank_address: string;
  account_number: string;
  sort_code: string;
  iban: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Balance {
  available_balance: number;
  total_earnings: number;
  total_requested: number;
  completed_bookings: number;
  pending_payouts: number;
  approved_payouts: number;
  paid_payouts: number;
}

export interface TotalBalance {
  available_balance: number;
  total_earnings: number;
  total_payouts_requested: number;
  currency: string;
  stats: {
    total_completed_bookings: number;
    total_payout_requests: number;
    pending_payouts: number;
    approved_payouts: number;
    paid_payouts: number;
  };
  breakdown: {
    earnings_from_completed_bookings: number;
    minus_payouts_requested: number;
    equals_available_balance: number;
  };
}

export interface PayoutRequest {
  payment_method: number;
  amount: string;
  notes: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class PayoutService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all payouts
  getPayouts(): Observable<ApiResponse<Payout[]>> {
    return this.http.get<ApiResponse<Payout[]>>(
      `${this.baseURL}/cleaner/api/payouts/`,
      { headers: this.getHeaders() }
    );
  }

  // Get payout by ID
  getPayoutById(id: number): Observable<ApiResponse<Payout>> {
    return this.http.get<ApiResponse<Payout>>(
      `${this.baseURL}/cleaner/api/payouts/${id}/`,
      { headers: this.getHeaders() }
    );
  }

  // Create payout request
  createPayout(payoutData: PayoutRequest): Observable<ApiResponse<Payout>> {
    return this.http.post<ApiResponse<Payout>>(
      `${this.baseURL}/cleaner/api/payouts/create/`,
      payoutData,
      { headers: this.getHeaders() }
    );
  }

  // Update payout request
  updatePayout(id: number, payoutData: PayoutRequest): Observable<ApiResponse<Payout>> {
    return this.http.put<ApiResponse<Payout>>(
      `${this.baseURL}/cleaner/api/payouts/${id}/update/`,
      payoutData,
      { headers: this.getHeaders() }
    );
  }

  // Delete payout request
  deletePayout(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseURL}/cleaner/api/payouts/${id}/delete/`,
      { headers: this.getHeaders() }
    );
  }

  // Get balance
  getBalance(): Observable<ApiResponse<Balance>> {
    return this.http.get<ApiResponse<Balance>>(
      `${this.baseURL}/cleaner/api/payouts/balance/`,
      { headers: this.getHeaders() }
    );
  }

  // Get total balance
  getTotalBalance(): Observable<ApiResponse<TotalBalance>> {
    return this.http.get<ApiResponse<TotalBalance>>(
      `${this.baseURL}/cleaner/api/payouts/total-balance/`,
      { headers: this.getHeaders() }
    );
  }

  // Get payment methods
  getPaymentMethods(): Observable<ApiResponse<PaymentMethod[]>> {
    return this.http.get<ApiResponse<PaymentMethod[]>>(
      `${this.baseURL}/cleaner/api/payment-methods/`,
      { headers: this.getHeaders() }
    );
  }
}