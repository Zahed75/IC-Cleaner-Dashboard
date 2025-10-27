import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface Address {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface ProfileInfo {
  role: string;
  role_display: string;
  status: string;
  status_display: string;
  phone_number: string;
  is_verified: boolean;
  dba_verification: boolean;
  rating: number;
  total_services_done: number;
  pending_services: number;
  on_hold_services: number;
  profile_picture_url: string;
  dba_document_url: string;
  has_profile_picture: boolean;
  has_dba_document: boolean;
  date_of_birth: string | null;
  emergency_contact: string;
  address: Address;
  email_notifications: boolean;
  sms_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface CleanerStatistics {
  average_rating: number;
  total_ratings: number;
  rating_breakdown: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  completion_rate: number;
}

export interface UserProfileResponse {
  user_info: UserInfo;
  profile_info: ProfileInfo;
  cleaner_statistics: CleanerStatistics;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface ChangePasswordRequest {
  new_password: string;
  confirm_new_password: string;
}

export interface ChangePasswordResponse {
  user_id: number;
  username: string;
  email: string;
  password_changed_at: string;
}

export interface ProfilePictureResponse {
  user_id: number;
  username: string;
  full_name: string;
  profile_picture_url: string;
  file_name: string;
  file_size: number;
  updated_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {
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

  // Get user profile by ID
  getUserProfile(userId: number): Observable<ApiResponse<UserProfileResponse>> {
    return this.http.get<ApiResponse<UserProfileResponse>>(
      `${this.baseURL}/auths/api/user/get-user/${userId}/`,
      { headers: this.getHeaders() }
    );
  }

  // Update user profile
  updateUserProfile(userId: number, profileData: UpdateProfileRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.baseURL}/auths/api/user/profile/${userId}/`,
      profileData,
      { headers: this.getHeaders() }
    );
  }

  // Change password
  changePassword(passwordData: ChangePasswordRequest): Observable<ApiResponse<ChangePasswordResponse>> {
    return this.http.post<ApiResponse<ChangePasswordResponse>>(
      `${this.baseURL}/auths/api/user/change-password/`,
      passwordData,
      { headers: this.getHeaders() }
    );
  }

  // Update profile picture
  updateProfilePicture(file: File): Observable<ApiResponse<ProfilePictureResponse>> {
    const formData = new FormData();
    formData.append('profile_picture', file);

    return this.http.post<ApiResponse<ProfilePictureResponse>>(
      `${this.baseURL}/auths/api/user/profile-picture/`,
      formData,
      { headers: this.getFormDataHeaders() }
    );
  }
}