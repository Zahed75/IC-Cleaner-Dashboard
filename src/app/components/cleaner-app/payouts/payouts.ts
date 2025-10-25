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
import { PayoutService, Payout, Balance, TotalBalance, PaymentMethod, ApiResponse } from '../../../services/cleaner-service/payout/payout-service';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

interface UIPayout {
  id: string;
  cleaner: string;
  payoutMethod: string;
  amount: number;
  status: string;
  originalData?: Payout;
}

@Component({
  selector: 'app-payouts',
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
  templateUrl: './payouts.html',
  styleUrls: ['./payouts.css'],
  providers: [MessageService]
})
export class CleanerPayoutsComponent implements OnInit {
  displayDetailsDialog = false;
  selectedPayout: any;
  loading = false;

  payouts: UIPayout[] = [];
  balanceData: Balance | null = null;
  totalBalanceData: TotalBalance | null = null;
  paymentMethods: PaymentMethod[] = [];

  constructor(
    private payoutService: PayoutService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPayouts();
    this.loadBalanceData();
    this.loadTotalBalance();
    this.loadPaymentMethods();
  }

  loadPayouts() {
    this.loading = true;
    this.payoutService.getPayouts().subscribe({
      next: (response: ApiResponse<Payout[]>) => {
        if (response.code === 200 && response.data) {
          this.payouts = response.data.map(payout => this.mapApiPayoutToUI(payout));
        } else {
          this.showError('Failed to load payouts: ' + response.message);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payouts:', error);
        this.showError('Failed to load payouts. Please try again.');
        this.loading = false;
      }
    });
  }

  loadBalanceData() {
    this.payoutService.getBalance().subscribe({
      next: (response: ApiResponse<Balance>) => {
        if (response.code === 200 && response.data) {
          this.balanceData = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading balance:', error);
      }
    });
  }

  loadTotalBalance() {
    this.payoutService.getTotalBalance().subscribe({
      next: (response: ApiResponse<TotalBalance>) => {
        if (response.code === 200 && response.data) {
          this.totalBalanceData = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading total balance:', error);
      }
    });
  }

  loadPaymentMethods() {
    this.payoutService.getPaymentMethods().subscribe({
      next: (response: ApiResponse<PaymentMethod[]>) => {
        if (response.code === 200 && response.data) {
          this.paymentMethods = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  private mapApiPayoutToUI(apiPayout: Payout): UIPayout {
    // Map API status to UI status
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'approved': 'Approved',
      'paid': 'Paid',
      'rejected': 'Rejected'
    };

    // Map payment method
    const methodMap: { [key: string]: string } = {
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer',
      'stripe': 'Stripe'
    };

    return {
      id: `CP#${apiPayout.id.toString().padStart(10, '0')}`,
      cleaner: `${apiPayout.cleaner_detail.first_name} ${apiPayout.cleaner_detail.last_name}`,
      payoutMethod: methodMap[apiPayout.payment_method_detail.method] || apiPayout.payment_method_detail.method,
      amount: parseFloat(apiPayout.amount),
      status: statusMap[apiPayout.status] || apiPayout.status,
      originalData: apiPayout
    };
  }

  showPayoutDetails(payout: UIPayout) {
    if (!payout.originalData) return;

    this.payoutService.getPayoutById(payout.originalData.id).subscribe({
      next: (response: ApiResponse<Payout>) => {
        if (response.code === 200 && response.data) {
          const payoutDetail = response.data;
          this.selectedPayout = {
            id: payout.id,
            cleanerName: `${payoutDetail.cleaner_detail.first_name} ${payoutDetail.cleaner_detail.last_name}`,
            balanceAmount: payoutDetail.available_balance,
            bankDetails: {
              method: this.getPaymentMethodDisplay(payoutDetail.payment_method_detail.method),
              company: payoutDetail.payment_method_detail.beneficiary_name || 'N/A',
              accountNo: payoutDetail.payment_method_detail.account_number || 'N/A',
              iban: payoutDetail.payment_method_detail.iban || 'N/A',
              sortCode: payoutDetail.payment_method_detail.sort_code || 'N/A',
              bankName: payoutDetail.payment_method_detail.bank_name || 'N/A',
              bankAddress: payoutDetail.payment_method_detail.bank_address || 'N/A',
              paypalEmail: payoutDetail.payment_method_detail.paypal_email || 'N/A'
            },
            payoutAmount: parseFloat(payoutDetail.amount),
            payoutStatus: this.mapStatus(payoutDetail.status),
            notes: payoutDetail.notes,
            created_at: new Date(payoutDetail.created_at).toLocaleDateString(),
            updated_at: new Date(payoutDetail.updated_at).toLocaleDateString()
          };
          this.displayDetailsDialog = true;
        }
      },
      error: (error) => {
        console.error('Error loading payout details:', error);
        this.showError('Failed to load payout details.');
      }
    });
  }

  private getPaymentMethodDisplay(method: string): string {
    const methodMap: { [key: string]: string } = {
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer',
      'stripe': 'Stripe'
    };
    return methodMap[method] || method;
  }

  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'approved': 'Approved',
      'paid': 'Paid',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): Severity {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warn';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  // Helper methods for stats cards
  getTotalDisputes(): number {
    return this.payouts.reduce((total, payout) => {
      return total + (payout.originalData?.disputes_total || 0);
    }, 0);
  }

  getPendingDisputes(): number {
    return this.payouts.reduce((total, payout) => {
      return total + (payout.originalData?.disputes_pending || 0);
    }, 0);
  }

  getResolvedDisputes(): number {
    return this.payouts.reduce((total, payout) => {
      return total + (payout.originalData?.disputes_resolved || 0);
    }, 0);
  }

  getHighPriorityDisputes(): number {
    return this.payouts.reduce((total, payout) => {
      return total + (payout.originalData?.disputes_high_priority || 0);
    }, 0);
  }

  getTotalPayoutsAmount(): number {
    return this.payouts.reduce((total, payout) => total + payout.amount, 0);
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