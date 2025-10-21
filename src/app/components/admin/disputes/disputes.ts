import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule, Tag } from 'primeng/tag';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DisputeService, Dispute, DisputeStats, DisputeDetail } from '../../../services/disputes/dispute-service';

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    FormsModule,
    Tag,
    Dialog,
    ToastModule
  ],
  templateUrl: './disputes.html',
  styleUrls: ['./disputes.css'],
  providers: [MessageService]
})
export class Disputes implements OnInit {
  disputes: Dispute[] = [];
  stats = {
    totalDisputes: 0,
    pending: 0,
    resolved: 0,
    highPriority: 0
  };

  searchText: string = '';
  disputeDialog: boolean = false;
  refundDialog: boolean = false;
  selectedDispute: Dispute | null = null;
  selectedDisputeDetail: DisputeDetail | null = null;
  refundAmount: number = 0;
  loading: boolean = false;
  commentText: string = '';
  resolutionNotes: string = '';

  constructor(
    private disputeService: DisputeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDisputes();
    this.loadDisputeStats();
  }

  loadDisputes(): void {
    this.loading = true;
    this.disputeService.getDisputes().subscribe({
      next: (response) => {
        this.disputes = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading disputes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load disputes'
        });
        this.loading = false;
      }
    });
  }

  loadDisputeStats(): void {
    this.disputeService.getDisputeStats().subscribe({
      next: (response) => {
        const stats = response.data;
        this.stats = {
          totalDisputes: stats.total_disputes,
          pending: stats.pending_disputes,
          resolved: stats.resolved_disputes,
          highPriority: stats.disputes_by_priority.find(p => p.priority === 'high')?.count || 0
        };
      },
      error: (error) => {
        console.error('Error loading dispute stats:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dispute statistics'
        });
      }
    });
  }

  get filteredDisputes(): Dispute[] {
    if (!this.searchText) return this.disputes;
    
    return this.disputes.filter(dispute => 
      dispute.id.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
      dispute.created_by_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      dispute.cleaner_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    switch (status.toLowerCase()) {
      case 'resolved': return 'success';
      case 'pending': return 'warn';
      case 'cancelled': return 'danger';
      case 'in_review': return 'info';
      case 'escalated': return 'danger';
      default: return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warn';
      case 'low': return 'info';
      case 'normal': return 'info';
      default: return 'secondary';
    }
  }

  showDisputeDetails(dispute: Dispute): void {
    this.selectedDispute = { ...dispute };
    this.selectedDisputeDetail = null; // Reset detail when opening new dispute
    this.loadDisputeDetail(dispute.id);
    this.disputeDialog = true;
  }

  loadDisputeDetail(disputeId: number): void {
    this.disputeService.getDisputeById(disputeId).subscribe({
      next: (response) => {
        this.selectedDisputeDetail = response.data;
      },
      error: (error) => {
        console.error('Error loading dispute detail:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dispute details'
        });
      }
    });
  }

  showRefundDialog(dispute: Dispute): void {
    this.selectedDispute = { ...dispute };
    this.refundAmount = parseFloat(dispute.payout_amount) * 0.5; // Default to 50% refund
    this.refundDialog = true;
  }

  resolveDispute(): void {
    if (this.selectedDispute) {
      this.disputeService.updateDisputeStatus(this.selectedDispute.id, {
        status: 'resolved'
      }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dispute resolved successfully'
          });
          this.updateLocalDisputeStatus(this.selectedDispute!.id, 'resolved');
          this.loadDisputeStats();
          this.disputeDialog = false;
        },
        error: (error) => {
          console.error('Error resolving dispute:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to resolve dispute'
          });
        }
      });
    }
  }

  cancelDispute(): void {
    if (this.selectedDispute) {
      this.disputeService.updateDisputeStatus(this.selectedDispute.id, {
        status: 'cancelled'
      }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dispute cancelled successfully'
          });
          this.updateLocalDisputeStatus(this.selectedDispute!.id, 'cancelled');
          this.loadDisputeStats();
          this.disputeDialog = false;
        },
        error: (error) => {
          console.error('Error cancelling dispute:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to cancel dispute'
          });
        }
      });
    }
  }

  confirmRefund(): void {
    if (this.selectedDispute && this.refundAmount > 0) {
      const resolveData = {
        resolution_notes: this.resolutionNotes || `Refund processed for amount: $${this.refundAmount}`,
        service_fee_refunded: true,
        refund_amount: this.refundAmount.toFixed(2),
        cleaner_payment_released: true
      };

      this.disputeService.resolveDispute(this.selectedDispute.id, resolveData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Refund processed successfully'
          });
          this.updateLocalDisputeStatus(this.selectedDispute!.id, 'resolved');
          this.loadDisputeStats();
          this.refundDialog = false;
          this.disputeDialog = false;
        },
        error: (error) => {
          console.error('Error processing refund:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to process refund'
          });
        }
      });
    }
  }

  addComment(): void {
    if (this.selectedDispute && this.commentText.trim()) {
      this.disputeService.addComment(this.selectedDispute.id, {
        comment: this.commentText,
        is_internal: false
      }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment added successfully'
          });
          this.commentText = '';
          if (this.selectedDispute) {
            this.loadDisputeDetail(this.selectedDispute.id);
          }
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add comment'
          });
        }
      });
    }
  }

  private updateLocalDisputeStatus(disputeId: number, status: string): void {
    const disputeIndex = this.disputes.findIndex(d => d.id === disputeId);
    if (disputeIndex !== -1) {
      this.disputes[disputeIndex].status = status;
      this.disputes[disputeIndex].updated_at = new Date().toISOString();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusActions(): string[] {
    if (!this.selectedDispute) return [];
    
    switch (this.selectedDispute.status) {
      case 'pending':
        return ['resolve', 'cancel', 'refund'];
      default:
        return [];
    }
  }

  // Helper methods to map API data to UI expectations
  getDisputeId(dispute: Dispute): string {
    return `LCD${dispute.id.toString().padStart(5, '0')}`;
  }

  getServiceFee(dispute: Dispute): number {
    return parseFloat(dispute.payout_amount);
  }

  getRefundAmount(dispute: Dispute): number {
    return parseFloat(dispute.refund_amount) || 0;
  }

  getDisputeReason(dispute: Dispute): string {
    return dispute.dispute_type.replace('_', ' ').toUpperCase();
  }

  getServiceProvided(): string {
    return 'Regular Cleaning'; // You might want to get this from actual data
  }

  getComment(dispute: Dispute): string {
    return dispute.title;
  }
}