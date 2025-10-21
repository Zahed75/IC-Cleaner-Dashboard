import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface CustomerProfile {
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
  dba_document: string | null;
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
}

export interface Customer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  profile: CustomerProfile;
}

export interface CreateClientRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  city: string;
  state: string;
  building_number: string;
  street: string;
  post_code: string;
  country: string;
  profile_picture?: File;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  // Get all customers - No authentication required
  getCustomers(): Observable<ApiResponse<Customer[]>> {
    return this.http.get<ApiResponse<Customer[]>>(`${this.baseURL}/customer/api/list-customers/`);
  }

  // Create new client - No authentication required
  createClient(clientData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseURL}/super-admin/api/admin/customers/create/`,
      clientData
    );
  }

  // Get client by ID - No authentication required
  getClientById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseURL}/super-admin/api/admin/customers/${id}/`
    );
  }

  // Update client - No authentication required
  updateClient(id: number, clientData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.baseURL}/super-admin/api/admin/customers/${id}/update/`,
      clientData
    );
  }

  // Delete client - No authentication required
  deleteClient(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseURL}/super-admin/api/admin/customers/${id}/delete/`
    );
  }

  // Convert form data to FormData for file upload
  createFormData(clientData: any): FormData {
    const formData = new FormData();
    
    // Add all fields to form data
    Object.keys(clientData).forEach(key => {
      if (clientData[key] !== null && clientData[key] !== undefined) {
        if (key === 'profile_picture' && clientData[key] instanceof File) {
          formData.append(key, clientData[key]);
        } else {
          formData.append(key, clientData[key].toString());
        }
      }
    });
    
    return formData;
  }
}