import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { DisputeService, Dispute, DisputeDetail, DisputeStatistics, ApiResponse } from '../../../services/cleaner-service/disputes/dispute-service';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

interface UIDispute {
  id: string;
  cleaner: string;
  customer: string;
  serviceDate: string;
  amount: number;
  status: string;
  priority: string;
  createdAt: string;
  originalData?: Dispute;
}

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule
  ],
  templateUrl: './disputes.html',
  styleUrls: ['./disputes.css'],
  providers: [MessageService]
})
export class CleanerDisputesComponent implements OnInit {
  displayDetailsDialog = false;
  selectedDispute: any;
  loading = false;

  disputes: UIDispute[] = [];
  statistics: DisputeStatistics | null = null;

  constructor(
    private disputeService: DisputeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDisputes();
    this.loadStatistics();
  }

  loadDisputes() {
    this.loading = true;
    this.disputeService.getDisputes().subscribe({
      next: (response: ApiResponse<Dispute[]>) => {
        if (response.code === 200 && response.data) {
          this.disputes = response.data.map(dispute => this.mapApiDisputeToUI(dispute));
        } else {
          this.showError('Failed to load disputes: ' + response.message);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading disputes:', error);
        this.showError('Failed to load disputes. Please try again.');
        this.loading = false;
      }
    });
  }

  loadStatistics() {
    this.disputeService.getDisputeStatistics().subscribe({
      next: (response: ApiResponse<DisputeStatistics>) => {
        if (response.code === 200 && response.data) {
          this.statistics = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  private mapApiDisputeToUI(apiDispute: Dispute): UIDispute {
    // Map API status to UI status
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'in_review': 'In Review',
      'resolved': 'Resolved',
      'closed': 'Closed'
    };

    // Map priority
    const priorityMap: { [key: string]: string } = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
      'normal': 'Medium'
    };

    return {
      id: `DSP#${apiDispute.id.toString().padStart(6, '0')}`,
      cleaner: 'Your Account', // Since it's the cleaner's own disputes
      customer: 'Customer', // You might want to get this from dispute details
      serviceDate: new Date(apiDispute.created_at).toISOString().split('T')[0],
      amount: apiDispute.payout_amount || 0,
      status: statusMap[apiDispute.status] || apiDispute.status,
      priority: priorityMap[apiDispute.priority] || apiDispute.priority,
      createdAt: new Date(apiDispute.created_at).toISOString().split('T')[0],
      originalData: apiDispute
    };
  }

  showDisputeDetails(dispute: UIDispute) {
    if (!dispute.originalData) return;

    this.disputeService.getDisputeById(dispute.originalData.id).subscribe({
      next: (response: ApiResponse<DisputeDetail>) => {
        if (response.code === 200 && response.data) {
          const disputeDetail = response.data;
          this.selectedDispute = {
            id: dispute.id,
            cleaner: `${disputeDetail.payout_detail.cleaner_detail.first_name} ${disputeDetail.payout_detail.cleaner_detail.last_name}`,
            customer: 'Customer', // You might want to get this from the dispute details
            serviceDate: new Date(disputeDetail.created_at).toISOString().split('T')[0],
            amount: parseFloat(disputeDetail.payout_detail.amount),
            status: this.mapStatus(disputeDetail.status),
            priority: this.mapPriority(disputeDetail.priority),
            createdAt: new Date(disputeDetail.created_at).toISOString().split('T')[0],
            disputeDetails: {
              description: disputeDetail.description || 'No description provided',
              evidence: this.getEvidenceFromComments(disputeDetail.comments),
              resolution: disputeDetail.resolution_notes || 'No resolution notes available',
              assignedTo: disputeDetail.resolved_by_detail ? 
                `${disputeDetail.resolved_by_detail.first_name} ${disputeDetail.resolved_by_detail.last_name}` : 
                'Not assigned',
              lastUpdated: new Date(disputeDetail.updated_at).toLocaleString(),
              comments: disputeDetail.comments,
              refundAmount: disputeDetail.refund_amount,
              serviceFeeHeld: disputeDetail.service_fee_held,
              serviceFeeRefunded: disputeDetail.service_fee_refunded,
              cleanerPaymentHeld: disputeDetail.cleaner_payment_held
            }
          };
          this.displayDetailsDialog = true;
        }
      },
      error: (error) => {
        console.error('Error loading dispute details:', error);
        this.showError('Failed to load dispute details.');
      }
    });
  }

  private getEvidenceFromComments(comments: any[]): string[] {
    // Extract evidence from comments or return default
    const evidence: string[] = [];
    comments.forEach(comment => {
      if (comment.comment.toLowerCase().includes('photo') || comment.comment.toLowerCase().includes('evidence')) {
        evidence.push(`comment_evidence_${comment.id}.txt`);
      }
    });
    return evidence.length > 0 ? evidence : ['No evidence files available'];
  }

  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'in_review': 'In Review',
      'resolved': 'Resolved',
      'closed': 'Closed'
    };
    return statusMap[status] || status;
  }

  private mapPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
      'normal': 'Medium'
    };
    return priorityMap[priority] || priority;
  }

  getStatusSeverity(status: string): Severity {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'success';
      case 'in review':
        return 'info';
      case 'pending':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): Severity {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Helper methods for stats cards
  getTotalDisputes(): number {
    return this.statistics?.total_disputes || this.disputes.length;
  }

  getPendingDisputes(): number {
    return this.statistics?.pending_disputes || 
           this.disputes.filter(d => d.status === 'Pending').length;
  }

  getResolvedDisputes(): number {
    return this.statistics?.resolved_disputes || 
           this.disputes.filter(d => d.status === 'Resolved').length;
  }

  getHighPriorityDisputes(): number {
    return this.statistics?.high_priority_disputes || 
           this.disputes.filter(d => d.priority === 'High').length;
  }

  getAverageResolutionDays(): string {
    const avgDays = this.statistics?.avg_resolution_days || 2.3;
    return `${avgDays} days`;
  }

  getSatisfactionRate(): string {
    const rate = this.statistics?.satisfaction_rate || 94;
    return `${rate}%`;
  }

  // Toast message methods
  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}