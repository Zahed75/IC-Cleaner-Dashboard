import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface ReportFilters {
  date_from: string;
  date_to: string;
  service_id: number | null;
  location: string | null;
  cleaner_id: number;
}

export interface KPI {
  value: number;
  delta?: number;
  delta_pct?: number;
  positive_pct?: number;
}

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartData {
  labels: string[];
  series: ChartSeries[];
}

export interface ReportData {
  filters: ReportFilters;
  kpis: {
    total_bookings: KPI;
    revenue: KPI;
    avg_rating: KPI;
    active_disputes: KPI;
  };
  charts: {
    revenue_overview: ChartData;
    service_distribution: any[];
  };
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ReportFiltersUI {
  range: string;
  service_id?: number;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get reports with filters
  getReports(filters: ReportFiltersUI): Observable<ApiResponse<ReportData>> {
    let params = new HttpParams();
    
    // Add filters to params
    if (filters.range) {
      params = params.set('range', filters.range);
    }
    if (filters.service_id) {
      params = params.set('service_id', filters.service_id.toString());
    }
    if (filters.location && filters.location !== 'all') {
      params = params.set('location', filters.location);
    }

    return this.http.get<ApiResponse<ReportData>>(
      `${this.baseURL}/cleaner/api/reports/`,
      { 
        headers: this.getHeaders(),
        params: params
      }
    );
  }
}