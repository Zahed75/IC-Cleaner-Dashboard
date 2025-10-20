// src/app/services/service-management.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviornments/environment';
import { AuthService } from '../../services/auth/auth-service';

export interface Service {
  id: number;
  name: string;
  price_per_hour: string;
  platform_fee_per_hour: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequest {
  name: string;
  price_per_hour: number;
  platform_fee_per_hour: number;
  is_active: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  price_per_hour?: number;
  platform_fee_per_hour?: number;
  is_active?: boolean;
}

export interface ServiceListResponse {
  code: number;
  message: string;
  data: Service[];
}

export interface ServiceResponse {
  code: number;
  message: string;
  data: Service;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceManagementService {
  private baseURL = `${environment.baseURL}/super-admin/api/services`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Get all services
  getServices(): Observable<ServiceListResponse> {
    return this.http.get<ServiceListResponse>(`${this.baseURL}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get service by ID
  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.baseURL}/${id}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Create new service
  createService(serviceData: CreateServiceRequest): Observable<Service> {
    return this.http.post<Service>(`${this.baseURL}/`, serviceData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Update service by ID
  updateService(id: number, serviceData: UpdateServiceRequest): Observable<ServiceResponse> {
    return this.http.patch<ServiceResponse>(`${this.baseURL}/${id}/`, serviceData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Delete service by ID
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Toggle service status
  toggleServiceStatus(id: number, isActive: boolean): Observable<ServiceResponse> {
    return this.http.patch<ServiceResponse>(`${this.baseURL}/${id}/`, { is_active: isActive }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Handle API errors
  private handleError(error: any) {
    console.error('API Error:', error);
    
    // Check if it's an authentication error
    if (error.status === 401) {
      // Unauthorized - token might be expired or invalid
      this.authService.logout();
    }
    
    // You can customize error messages based on status codes
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request data. Please check your input.';
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

  // Helper method to check if user is authenticated before making requests
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Helper method to get user role
  getUserRole(): string | null {
    return this.authService.getUserRole();
  }
}