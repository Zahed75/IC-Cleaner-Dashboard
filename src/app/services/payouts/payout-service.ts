import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface Cleaner {
  id: number;
  name: string;
  email: string;
  phone: string;
  rating?: number;
  total_services?: number;
  dba_verified?: boolean;
  status?: string;
}

export interface PaymentMethod {
  id: number;
  method: string;
  details?: string;
  paypal_email?: string;
  beneficiary_name?: string;
  bank_name?: string;
  account_number?: string;
  iban?: string;
  is_default?: boolean;
}

export interface Payout {
  id: number;
  payout_id: string;
  cleaner: Cleaner;
  booking: any;
  payment_method: PaymentMethod;
  amount: number;
  status: string;
  payout_type: string;
  notes: string;
  disputes_total: number;
  disputes_pending: number;
  disputes_resolved?: number;
  disputes_high_priority?: number;
  disputes?: any[];
  created_at: string;
  updated_at: string;
}

export interface PayoutStats {
  total_payouts: number;
  pending_payouts: number;
  approved_payouts: number;
  paid_payouts: number;
  rejected_payouts: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  booking_payouts: number;
  general_payouts: number;
  recent_payouts: number;
  average_payout: number;
  completion_rate: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface StatusUpdateResponse {
  id: number;
  payout_id: string;
  status: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayoutService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  // Get all payouts
  getPayouts(): Observable<ApiResponse<Payout[]>> {
    return this.http.get<ApiResponse<Payout[]>>(`${this.baseURL}/super-admin/api/payouts/`);
  }

  // Get payout by ID
  getPayoutById(id: number): Observable<ApiResponse<Payout>> {
    return this.http.get<ApiResponse<Payout>>(`${this.baseURL}/super-admin/api/payouts/${id}/`);
  }

  // Get payout statistics
  getPayoutStats(): Observable<ApiResponse<PayoutStats>> {
    return this.http.get<ApiResponse<PayoutStats>>(`${this.baseURL}/super-admin/api/payouts/stats/`);
  }

  // Approve payout
  approvePayout(id: number): Observable<ApiResponse<StatusUpdateResponse>> {
    return this.http.post<ApiResponse<StatusUpdateResponse>>(
      `${this.baseURL}/super-admin/api/payouts/${id}/approve/`,
      {}
    );
  }

  // Mark payout as paid
  markPayoutAsPaid(id: number): Observable<ApiResponse<StatusUpdateResponse>> {
    return this.http.post<ApiResponse<StatusUpdateResponse>>(
      `${this.baseURL}/super-admin/api/payouts/${id}/mark-paid/`,
      {}
    );
  }

  // Reject payout
  rejectPayout(id: number): Observable<ApiResponse<StatusUpdateResponse>> {
    return this.http.post<ApiResponse<StatusUpdateResponse>>(
      `${this.baseURL}/super-admin/api/payouts/${id}/reject/`,
      {}
    );
  }
}