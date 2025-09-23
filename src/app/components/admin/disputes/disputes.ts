import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule, Tag } from 'primeng/tag';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

interface Dispute {
  id: string;
  client: string;
  cleaner: string;
  serviceProvided: string;
  reason: string;
  comment: string;
  status: string;
  serviceFee: number;
  refundAmount?: number;
  priority: 'Low' | 'Medium' | 'High';
  createdDate: string;
  resolvedDate?: string;
}

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
      Dialog
],
  templateUrl: './disputes.html',
  styleUrls: ['./disputes.css']
})
export class Disputes {
  disputes: Dispute[] = [
    {
      id: 'LCD42508',
      client: 'Joseph Tribbiani',
      cleaner: 'Hogar Nati',
      serviceProvided: 'Regular Cleaning',
      reason: 'Late Arrival',
      comment: 'Cleaner arrived 45 minutes late, client requesting partial refund.',
      status: 'Pending',
      serviceFee: 50.00,
      priority: 'High',
      createdDate: '2024-01-15'
    },
    {
      id: 'LCD42509',
      client: 'Joseph Tribbiani',
      cleaner: 'Hogar Nati',
      serviceProvided: 'Deep Cleaning',
      reason: 'Quality Issues',
      comment: 'Client claims bathroom wasn\'t properly cleaned, requesting reclean.',
      status: 'Resolved',
      serviceFee: 120.00,
      refundAmount: 30.00,
      priority: 'Medium',
      createdDate: '2024-01-14',
      resolvedDate: '2024-01-15'
    },
    {
      id: 'LCD42510',
      client: 'Joseph Tribbiani',
      cleaner: 'Hogar Nati',
      serviceProvided: 'Regular Cleaning',
      reason: 'Cancelled Service',
      comment: 'Client cancelled last minute, cleaner requesting cancellation fee.',
      status: 'Cancelled',
      serviceFee: 50.00,
      priority: 'Low',
      createdDate: '2024-01-13'
    },
    {
      id: 'LCD42511',
      client: 'Monica Geller',
      cleaner: 'Hogar Nati',
      serviceProvided: 'Move Out Cleaning',
      reason: 'Damage Claim',
      comment: 'Client claims items were damaged during cleaning process.',
      status: 'Pending',
      serviceFee: 200.00,
      priority: 'High',
      createdDate: '2024-01-16'
    },
    {
      id: 'LCD42512',
      client: 'Chandler Bing',
      cleaner: 'Hogar Nati',
      serviceProvided: 'Regular Cleaning',
      reason: 'Incomplete Service',
      comment: 'Client states kitchen area was not cleaned as promised.',
      status: 'Resolved',
      serviceFee: 60.00,
      refundAmount: 25.00,
      priority: 'Medium',
      createdDate: '2024-01-12',
      resolvedDate: '2024-01-13'
    }
  ];

  stats = {
    totalDisputes: 79,
    pending: 1,
    resolved: 78,
    highPriority: 1
  };

  searchText: string = '';
  disputeDialog: boolean = false;
  refundDialog: boolean = false;
  selectedDispute: Dispute | null = null;
  refundAmount: number = 0;

  get filteredDisputes(): Dispute[] {
    if (!this.searchText) return this.disputes;
    
    return this.disputes.filter(dispute => 
      dispute.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
      dispute.client.toLowerCase().includes(this.searchText.toLowerCase()) ||
      dispute.cleaner.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Resolved': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): string {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  }

  showDisputeDetails(dispute: Dispute): void {
    this.selectedDispute = { ...dispute };
    this.disputeDialog = true;
  }

  showRefundDialog(dispute: Dispute): void {
    this.selectedDispute = { ...dispute };
    this.refundAmount = dispute.serviceFee * 0.5; // Default to 50% refund
    this.refundDialog = true;
  }

  resolveDispute(): void {
    if (this.selectedDispute) {
      const disputeIndex = this.disputes.findIndex(d => d.id === this.selectedDispute!.id);
      if (disputeIndex !== -1) {
        this.disputes[disputeIndex].status = 'Resolved';
        this.disputes[disputeIndex].resolvedDate = new Date().toISOString().split('T')[0];
      }
      this.disputeDialog = false;
    }
  }

  cancelDispute(): void {
    if (this.selectedDispute) {
      const disputeIndex = this.disputes.findIndex(d => d.id === this.selectedDispute!.id);
      if (disputeIndex !== -1) {
        this.disputes[disputeIndex].status = 'Cancelled';
      }
      this.disputeDialog = false;
    }
  }

  confirmRefund(): void {
    if (this.selectedDispute && this.refundAmount > 0) {
      const disputeIndex = this.disputes.findIndex(d => d.id === this.selectedDispute!.id);
      if (disputeIndex !== -1) {
        this.disputes[disputeIndex].status = 'Resolved';
        this.disputes[disputeIndex].refundAmount = this.refundAmount;
        this.disputes[disputeIndex].resolvedDate = new Date().toISOString().split('T')[0];
      }
      this.refundDialog = false;
      this.disputeDialog = false;
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
      case 'Pending':
        return ['resolve', 'cancel', 'refund'];
      default:
        return [];
    }
  }
}