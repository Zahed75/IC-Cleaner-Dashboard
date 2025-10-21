


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviornments/environment';

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
    dba_document?: string;
  };
}

export interface CreateCleanerRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  password: string;
  city: string;
  state: string;
  country: string;
  dba_verification: boolean;
  rating?: number;
  total_services_done?: number;
  pending_services?: number;
  profile_picture?: File;
  dba_document?: File;
}

export interface UpdateCleanerRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: string;
  password?: string;
  city?: string;
  state?: string;
  country?: string;
  dba_verification?: boolean;
  rating?: number;
  total_services_done?: number;
  pending_services?: number;
  profile_picture?: File;
  dba_document?: File;
}

export interface CleanerListResponse {
  code: number;
  message: string;
  data: Cleaner[];
}

export interface CleanerResponse {
  code: number;
  message: string;
  data: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    role: string;
    status: string;
    phone_number: string;
    is_verified: boolean;
    city: string;
    state: string;
    country: string;
    created_at: string;
    dba_verification: boolean;
    rating: number;
    total_services_done: number;
    pending_services: number;
    on_hold_services: number;
    profile_picture: string;
    dba_document: string;
  };
}

export interface UserResponse {
  code: number;
  message: string;
  data: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    role: string;
    status: string;
    phone_number: string;
    is_verified: boolean;
    city: string;
    state: string;
    country: string;
    created_at: string;
    dba_verification: boolean;
    rating: number;
    total_services_done: number;
    pending_services: number;
    profile_picture: string;
    dba_document: string;
  };
}

export interface StatusToggleResponse {
  code: number;
  message: string;
  data: {
    id: number;
    is_active: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CleanerService {
  private baseURL = `${environment.baseURL}/super-admin/api/admin/users`;
  private cleanerURL = `${environment.baseURL}/cleaner/api/list-cleaners`;
  private http = inject(HttpClient);

  // Get all cleaners
  getCleaners(): Observable<CleanerListResponse> {
    return this.http.get<CleanerListResponse>(`${this.cleanerURL}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get cleaner by ID
  getCleanerById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseURL}/${id}/`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Create new cleaner with file upload
  createCleaner(cleanerData: CreateCleanerRequest): Observable<CleanerResponse> {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('email', cleanerData.email);
    formData.append('first_name', cleanerData.first_name);
    formData.append('last_name', cleanerData.last_name);
    formData.append('phone_number', cleanerData.phone_number);
    formData.append('role', cleanerData.role);
    formData.append('password', cleanerData.password);
    formData.append('city', cleanerData.city);
    formData.append('state', cleanerData.state);
    formData.append('country', cleanerData.country);
    
    // Convert boolean to proper string format for Django
    formData.append('dba_verification', cleanerData.dba_verification ? 'True' : 'False');
    
    formData.append('rating', (cleanerData.rating || 5).toString());
    formData.append('total_services_done', (cleanerData.total_services_done || 0).toString());
    formData.append('pending_services', (cleanerData.pending_services || 0).toString());
    
    // Append files if they exist
    if (cleanerData.profile_picture) {
      formData.append('profile_picture', cleanerData.profile_picture);
    }
    if (cleanerData.dba_document) {
      formData.append('dba_document', cleanerData.dba_document);
    }

    return this.http.post<CleanerResponse>(`${this.baseURL}/create/`, formData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Update cleaner by ID with file upload
  updateCleaner(id: number, cleanerData: UpdateCleanerRequest): Observable<CleanerResponse> {
    const formData = new FormData();
    
    // Append all fields to FormData if they exist
    if (cleanerData.email) formData.append('email', cleanerData.email);
    if (cleanerData.first_name) formData.append('first_name', cleanerData.first_name);
    if (cleanerData.last_name) formData.append('last_name', cleanerData.last_name);
    if (cleanerData.phone_number) formData.append('phone_number', cleanerData.phone_number);
    if (cleanerData.role) formData.append('role', cleanerData.role);
    if (cleanerData.password) formData.append('password', cleanerData.password);
    if (cleanerData.city) formData.append('city', cleanerData.city);
    if (cleanerData.state) formData.append('state', cleanerData.state);
    if (cleanerData.country) formData.append('country', cleanerData.country);
    
    // Convert boolean to proper string format for Django
    if (cleanerData.dba_verification !== undefined) {
      formData.append('dba_verification', cleanerData.dba_verification ? 'True' : 'False');
    }
    
    if (cleanerData.rating !== undefined) formData.append('rating', cleanerData.rating.toString());
    if (cleanerData.total_services_done !== undefined) formData.append('total_services_done', cleanerData.total_services_done.toString());
    if (cleanerData.pending_services !== undefined) formData.append('pending_services', cleanerData.pending_services.toString());
    
    // Append files if they exist
    if (cleanerData.profile_picture) {
      formData.append('profile_picture', cleanerData.profile_picture);
    }
    if (cleanerData.dba_document) {
      formData.append('dba_document', cleanerData.dba_document);
    }

    return this.http.put<CleanerResponse>(`${this.baseURL}/${id}/update/`, formData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Toggle cleaner status (activate/deactivate)
  toggleCleanerStatus(id: number): Observable<StatusToggleResponse> {
    return this.http.patch<StatusToggleResponse>(`${this.baseURL}/${id}/toggle-status/`, {}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Handle API errors
  private handleError(error: any) {
    console.error('Cleaner API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid cleaner data. Please check your input.';
    } else if (error.status === 401) {
      errorMessage = 'Authentication failed. Please login again.';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'The requested cleaner was not found.';
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