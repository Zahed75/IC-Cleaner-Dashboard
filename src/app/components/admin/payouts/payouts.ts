import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule, Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule, Tag } from 'primeng/tag';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PayoutService, Payout, PayoutStats, Cleaner, PaymentMethod } from '../../../services/payouts/payout-service';

@Component({
  selector: 'app-payouts',
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
    Card,
    Tag,
    Dialog,
    ToastModule
  ],
  templateUrl: './payouts.html',
  styleUrls: ['./payouts.css'],
  providers: [MessageService]
})
export class Payouts implements OnInit {
  payouts: Payout[] = [];
  stats: PayoutStats = {
    total_payouts: 0,
    pending_payouts: 0,
    approved_payouts: 0,
    paid_payouts: 0,
    rejected_payouts: 0,
    total_amount: 0,
    paid_amount: 0,
    pending_amount: 0,
    booking_payouts: 0,
    general_payouts: 0,
    recent_payouts: 0,
    average_payout: 0,
    completion_rate: 0
  };

  searchText: string = '';
  payoutDialog: boolean = false;
  selectedPayout: Payout | null = null;
  loading: boolean = false;

  constructor(
    private payoutService: PayoutService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPayouts();
    this.loadPayoutStats();
  }

  loadPayouts(): void {
    this.loading = true;
    this.payoutService.getPayouts().subscribe({
      next: (response) => {
        this.payouts = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payouts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payouts'
        });
        this.loading = false;
      }
    });
  }

  loadPayoutStats(): void {
    this.payoutService.getPayoutStats().subscribe({
      next: (response) => {
        this.stats = response.data;
      },
      error: (error) => {
        console.error('Error loading payout stats:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payout statistics'
        });
      }
    });
  }

  get filteredPayouts(): Payout[] {
    if (!this.searchText) return this.payouts;
    
    return this.payouts.filter(payout => 
      payout.payout_id.toLowerCase().includes(this.searchText.toLowerCase()) ||
      payout.cleaner.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warn';
      case 'rejected':
        return 'danger';
      case 'high priority':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  showPayoutDetails(payout: Payout): void {
    this.selectedPayout = { ...payout };
    this.payoutDialog = true;
  }

  approvePayout(): void {
    if (this.selectedPayout) {
      this.payoutService.approvePayout(this.selectedPayout.id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payout approved successfully'
          });
          this.updateLocalPayoutStatus(this.selectedPayout!.id, 'approved');
          this.loadPayoutStats(); // Refresh stats
          this.payoutDialog = false;
        },
        error: (error) => {
          console.error('Error approving payout:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve payout'
          });
        }
      });
    }
  }

  markAsPaid(): void {
    if (this.selectedPayout) {
      this.payoutService.markPayoutAsPaid(this.selectedPayout.id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payout marked as paid successfully'
          });
          this.updateLocalPayoutStatus(this.selectedPayout!.id, 'paid');
          this.loadPayoutStats(); // Refresh stats
          this.payoutDialog = false;
        },
        error: (error) => {
          console.error('Error marking payout as paid:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to mark payout as paid'
          });
        }
      });
    }
  }

  rejectPayout(): void {
    if (this.selectedPayout) {
      this.payoutService.rejectPayout(this.selectedPayout.id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payout rejected successfully'
          });
          this.updateLocalPayoutStatus(this.selectedPayout!.id, 'rejected');
          this.loadPayoutStats(); // Refresh stats
          this.payoutDialog = false;
        },
        error: (error) => {
          console.error('Error rejecting payout:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reject payout'
          });
        }
      });
    }
  }

  private updateLocalPayoutStatus(payoutId: number, status: string): void {
    const payoutIndex = this.payouts.findIndex(p => p.id === payoutId);
    if (payoutIndex !== -1) {
      this.payouts[payoutIndex].status = status;
      this.payouts[payoutIndex].updated_at = new Date().toISOString();
    }
  }

  getBankDetails(paymentMethod: PaymentMethod) {
    if (paymentMethod.method === 'Bank Transfer') {
      return {
        accountName: paymentMethod.beneficiary_name || 'N/A',
        accountNo: paymentMethod.account_number || 'N/A',
        iban: paymentMethod.iban || 'N/A',
        bankName: paymentMethod.bank_name || 'N/A'
      };
    } else if (paymentMethod.method === 'PayPal') {
      return {
        email: paymentMethod.paypal_email || 'N/A'
      };
    }
    return {};
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

  getPayoutHistory(payout: Payout): any[] {
    const history = [
      { action: 'Requested', date: payout.created_at, status: 'Pending' }
    ];

    if (payout.status === 'approved' || payout.status === 'paid') {
      history.push({ action: 'Approved', date: payout.updated_at, status: 'Approved' });
    }

    if (payout.status === 'paid') {
      history.push({ action: 'Paid', date: payout.updated_at, status: 'Paid' });
    }

    return history;
  }

  // Helper method to get currency symbol (you might want to get this from API)
  getCurrencySymbol(): string {
    return '$'; // Default to $, you can modify based on your needs
  }

  // Helper method to get balance amount (you might need to adjust this based on your API)
  getBalanceAmount(payout: Payout): number {
    // This is a placeholder - adjust based on your actual data structure
    return payout.amount * 2; // Example calculation
  }
}