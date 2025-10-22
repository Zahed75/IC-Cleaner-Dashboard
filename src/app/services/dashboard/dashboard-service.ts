import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface TodaysMetrics {
  todays_bookings: number;
  todays_revenue: number;
  todays_revenue_formatted: string;
  active_cleaners: number;
  pending_disputes: number;
  revenue_change: number;
  todays_pending_bookings: number;
  todays_completed_bookings: number;
}

export interface RecentBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  service_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  status_display: string;
  assign_cleaner: string;
  location: string;
  special_requirements: string;
  payment_status: string;
  created_at: string;
}

export interface RecentPayout {
  id: number;
  payout_id: string;
  cleaner_name: string;
  cleaner_email: string;
  amount: number;
  status: string;
  status_display: string;
  payout_type: string;
  payout_type_display: string;
  payment_method: string;
  booking: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_recent_bookings: number;
  total_recent_payouts: number;
  last_updated: string;
}

export interface DashboardOverview {
  todays_metrics: TodaysMetrics;
  recent_bookings: RecentBooking[];
  recent_payouts: RecentPayout[];
  summary: DashboardSummary;
}

export interface QuickStats {
  todays_bookings: number;
  todays_revenue: number;
  todays_revenue_formatted: string;
  active_cleaners: number;
  pending_disputes: number;
  total_pending_bookings: number;
  total_active_cleaners: number;
  weekly_revenue: number;
  weekly_revenue_formatted: string;
  monthly_revenue: number;
  monthly_revenue_formatted: string;
  last_updated: string;
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

  // Get dashboard overview
  getDashboardOverview(): Observable<ApiResponse<DashboardOverview>> {
    return this.http.get<ApiResponse<DashboardOverview>>(`${this.baseURL}/report/api/admin/dashboard/overview/`);
  }

  // Get quick stats
  getQuickStats(): Observable<ApiResponse<QuickStats>> {
    return this.http.get<ApiResponse<QuickStats>>(`${this.baseURL}/report/api/admin/dashboard/quick-stats/`);
  }
}