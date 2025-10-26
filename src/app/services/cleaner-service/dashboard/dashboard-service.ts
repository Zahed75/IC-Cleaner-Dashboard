import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

// Add this new interface for ratings
export interface RatingStatistics {
  total_ratings: number;
  average_rating: number;
  rating_breakdown: {
    '5_star': {
      count: number;
      percentage: number;
    };
    '4_star': {
      count: number;
      percentage: number;
    };
    '3_star': {
      count: number;
      percentage: number;
    };
    '2_star': {
      count: number;
      percentage: number;
    };
    '1_star': {
      count: number;
      percentage: number;
    };
  };
}

export interface MyRatingsResponse {
  ratings: any[];
  statistics: RatingStatistics;
  filters_applied: {
    rating: number | null;
    service: string | null;
  };
}

export interface DashboardStatistics {
  today_overview: {
    total_bookings: number;
    completed_bookings: number;
    revenue: number;
    pending_bookings: number;
  };
  ratings: {
    average_rating: number;
    total_ratings: number;
    breakdown: {
      '5_star': number;
      '4_star': number;
      '3_star': number;
      '2_star': number;
      '1_star': number;
    };
  };
  performance: {
    weekly: {
      total_bookings: number;
      completed_bookings: number;
      revenue: number;
      daily_breakdown: Array<{
        date: string;
        day_name: string;
        total_bookings: number;
        completed_bookings: number;
        revenue: number;
      }>;
    };
    monthly: {
      total_bookings: number;
      completed_bookings: number;
      revenue: number;
    };
    yearly: {
      total_bookings: number;
      completed_bookings: number;
      revenue: number;
      monthly_breakdown: Array<{
        month: number;
        month_name: string;
        total_bookings: number;
        completed_bookings: number;
        revenue: number;
      }>;
    };
  };
  upcoming_bookings: any[];
  earnings_breakdown: {
    total_earnings: number;
    total_platform_fees: number;
    service_breakdown: Array<{
      service: string;
      earnings: number;
    }>;
  };
  quick_stats: {
    completion_rate: number;
    avg_booking_value: number;
    active_disputes: number;
    available_statuses: string[];
  };
}

export interface DBAVerificationStatus {
  dba_verified: boolean;
  has_dba_document: boolean;
  user_id: number;
  role: string;
  account_status: string;
}

export interface PayoutRequest {
  payment_method: number;
  amount: string;
  notes: string;
}

export interface PayoutResponse {
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

export interface Balance {
  available_balance: number;
  total_earnings: number;
  total_requested: number;
  completed_bookings: number;
  pending_payouts: number;
  approved_payouts: number;
  paid_payouts: number;
  debug?: {
    user_id: number;
    is_cleaner: boolean;
    booking_count: number;
    booking_details: Array<{
      booking_id: number;
      service: string;
      price_per_hour: number;
      platform_fee: number;
      earnings: number;
    }>;
  };
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

  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get dashboard statistics
  getDashboardStatistics(): Observable<ApiResponse<DashboardStatistics>> {
    return this.http.get<ApiResponse<DashboardStatistics>>(
      `${this.baseURL}/cleaner/api/dashboard/statistics/`,
      { headers: this.getHeaders() }
    );
  }

  // Get DBA verification status
  getDBAVerificationStatus(): Observable<ApiResponse<DBAVerificationStatus>> {
    return this.http.get<ApiResponse<DBAVerificationStatus>>(
      `${this.baseURL}/auths/api/dba/verification-status/`,
      { headers: this.getHeaders() }
    );
  }

  // Upload DBA document
  uploadDBADocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('dba_document', file);

    return this.http.post(
      `${this.baseURL}/auths/api/dba/upload-document/`,
      formData,
      { headers: this.getFormDataHeaders() }
    );
  }

  // Create payout request
  createPayout(payoutData: PayoutRequest): Observable<ApiResponse<PayoutResponse>> {
    return this.http.post<ApiResponse<PayoutResponse>>(
      `${this.baseURL}/cleaner/api/payouts/create/`,
      payoutData,
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

  // Get my ratings
  getMyRatings(): Observable<ApiResponse<MyRatingsResponse>> {
    return this.http.get<ApiResponse<MyRatingsResponse>>(
      `${this.baseURL}/cleaner/api/ratings/my-ratings/`,
      { headers: this.getHeaders() }
    );
  }
}