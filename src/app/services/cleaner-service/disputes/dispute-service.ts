import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface Dispute {
  id: number;
  title: string;
  dispute_type: string;
  status: string;
  priority: string;
  created_at: string;
  payout_amount: number;
  service_name: string;
}

export interface DisputeDetail {
  id: number;
  payout: number;
  payout_detail: {
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
  };
  title: string;
  description: string;
  dispute_type: string;
  status: string;
  priority: string;
  service_fee_held: string;
  service_fee_refunded: boolean;
  cleaner_payment_held: boolean;
  refund_amount: string;
  resolution_notes: string;
  resolved_by: number;
  resolved_by_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_by: number;
  created_by_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  comments: Comment[];
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user: number;
  user_detail: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  user_name: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
}

export interface DisputeStatistics {
  total_disputes: number;
  pending_disputes: number;
  resolved_disputes: number;
  high_priority_disputes: number;
  avg_resolution_days: number;
  satisfaction_rate: number;
  recent_disputes_30_days: number;
  escalated_disputes: number;
  breakdown: {
    by_type: Array<{
      dispute_type: string;
      count: number;
    }>;
    by_priority: Array<{
      priority: string;
      count: number;
    }>;
    by_status: Array<{
      status: string;
      count: number;
    }>;
  };
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all disputes
  getDisputes(): Observable<ApiResponse<Dispute[]>> {
    return this.http.get<ApiResponse<Dispute[]>>(
      `${this.baseURL}/cleaner/api/disputes/`,
      { headers: this.getHeaders() }
    );
  }

  // Get dispute by ID
  getDisputeById(id: number): Observable<ApiResponse<DisputeDetail>> {
    return this.http.get<ApiResponse<DisputeDetail>>(
      `${this.baseURL}/cleaner/api/disputes/${id}/`,
      { headers: this.getHeaders() }
    );
  }

  // Get dispute statistics
  getDisputeStatistics(): Observable<ApiResponse<DisputeStatistics>> {
    return this.http.get<ApiResponse<DisputeStatistics>>(
      `${this.baseURL}/cleaner/api/cleaner-statistics/`,
      { headers: this.getHeaders() }
    );
  }
}