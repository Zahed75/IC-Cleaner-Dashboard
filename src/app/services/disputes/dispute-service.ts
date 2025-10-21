import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface Dispute {
  id: number;
  title: string;
  dispute_type: string;
  status: string;
  priority: string;
  created_by_name: string;
  cleaner_name: string;
  payout_amount: string;
  refund_amount: string;
  service_fee_held: string;
  service_fee_refunded: boolean;
  cleaner_payment_held: boolean;
  comment_count: number;
  description?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  payout_detail?: any;
  created_by_detail?: any;
  comments?: Comment[];
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

export interface DisputeStats {
  total_disputes: number;
  pending_disputes: number;
  in_review_disputes: number;
  resolved_disputes: number;
  escalated_disputes: number;
  disputes_by_type: Array<{ dispute_type: string; count: number }>;
  disputes_by_priority: Array<{ priority: string; count: number }>;
  disputes_by_creator: Array<{ created_by_role: string; count: number }>;
  total_service_fees_held: number;
  resolution_rate: number;
}

export interface DisputeDetail {
  id: number;
  payout: number;
  payout_detail: any;
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
  resolved_by_detail: any;
  created_by: number;
  created_by_detail: any;
  comments: Comment[];
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface StatusUpdateRequest {
  status?: string;
  priority?: string;
  resolution_notes?: string;
  service_fee_refunded?: boolean;
  cleaner_payment_held?: boolean;
}

export interface ResolveRequest {
  resolution_notes: string;
  service_fee_refunded: boolean;
  refund_amount: string;
  cleaner_payment_released: boolean;
}

export interface CommentRequest {
  comment: string;
  is_internal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  // Get all disputes
  getDisputes(): Observable<ApiResponse<Dispute[]>> {
    return this.http.get<ApiResponse<Dispute[]>>(`${this.baseURL}/super-admin/api/admin/disputes/`);
  }

  // Get dispute statistics
  getDisputeStats(): Observable<ApiResponse<DisputeStats>> {
    return this.http.get<ApiResponse<DisputeStats>>(`${this.baseURL}/super-admin/api/admin/disputes/stats/`);
  }

  // Get dispute by ID
  getDisputeById(id: number): Observable<ApiResponse<DisputeDetail>> {
    return this.http.get<ApiResponse<DisputeDetail>>(`${this.baseURL}/super-admin/api/admin/disputes/${id}/`);
  }

  // Update dispute status
  updateDisputeStatus(id: number, data: StatusUpdateRequest): Observable<ApiResponse<DisputeDetail>> {
    return this.http.patch<ApiResponse<DisputeDetail>>(
      `${this.baseURL}/super-admin/api/admin/disputes/${id}/update-status/`,
      data
    );
  }

  // Add comment to dispute
  addComment(id: number, data: CommentRequest): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(
      `${this.baseURL}/super-admin/api/admin/disputes/${id}/add-comment/`,
      data
    );
  }

  // Resolve dispute
  resolveDispute(id: number, data: ResolveRequest): Observable<ApiResponse<DisputeDetail>> {
    return this.http.post<ApiResponse<DisputeDetail>>(
      `${this.baseURL}/super-admin/api/admin/disputes/${id}/resolve/`,
      data
    );
  }
}