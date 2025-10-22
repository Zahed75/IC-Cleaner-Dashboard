import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface KeyMetrics {
  total_bookings: number;
  booking_change: number;
  revenue: number;
  revenue_change: number;
  avg_rating: number;
  positive_rating: number;
  active_cleaners: number;
  cleaner_change: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  revenue_data?: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface Charts {
  revenue_trend: ChartData;
  service_distribution: ChartData;
}

export interface AdditionalMetrics {
  completion_rate: number;
  satisfaction_rate: number;
  repeat_rate: number;
  avg_response_time: number;
}

export interface Filters {
  date_range: string;
  start_date: string;
  end_date: string;
  service_type: string | null;
  location: string | null;
}

export interface OverviewReport {
  key_metrics: KeyMetrics;
  charts: Charts;
  additional_metrics: AdditionalMetrics;
  filters: Filters;
}

export interface ExportReport extends OverviewReport {
  export_format: string;
}

export interface Service {
  id: number;
  name: string;
}

export interface DateRangeOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  services: Service[];
  locations: string[];
  date_range_options: DateRangeOption[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  // Get overview report
  getOverviewReport(params?: any): Observable<ApiResponse<OverviewReport>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<OverviewReport>>(`${this.baseURL}/report/api/admin/reports/overview/`, { params: httpParams });
  }

  // Export report
  exportReport(params?: any): Observable<ApiResponse<ExportReport>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<ExportReport>>(`${this.baseURL}/report/api/admin/reports/export/`, { params: httpParams });
  }

  // Get filter options
  getFilterOptions(): Observable<ApiResponse<FilterOptions>> {
    return this.http.get<ApiResponse<FilterOptions>>(`${this.baseURL}/report/api/admin/reports/filters/`);
  }
}