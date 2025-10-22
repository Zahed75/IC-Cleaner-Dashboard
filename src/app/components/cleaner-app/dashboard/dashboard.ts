import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';

interface PayoutRequest {
  amount: number | null;
  paymentMethod: string;
  status: 'idle' | 'success' | 'error' | 'processing';
  statusMessage: string;
}

interface PaymentMethod {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    DialogModule,
    AutoCompleteModule,
    InputTextModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class CleanerDashboardComponent {
  // Dashboard data
  dashboardData = {
    userName: 'John',
    todayBookings: 3,
    completedToday: 1,
    todayRevenue: 489.02,
    availableBalance: 489.02,
    nextPayout: 489.02,
    payoutDate: 'August 31',
    rating: 4.7,
    ratingPercentage: 94,
    totalReviews: 128
  };

  // Alert statuses
  alerts = {
    verificationRequired: true,
    payoutInfoRequired: true
  };

  // Payout request data
  payoutRequest: PayoutRequest = {
    amount: null,
    paymentMethod: '',
    status: 'idle',
    statusMessage: ''
  };

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Stripe', value: 'stripe' },
    { label: 'Wise', value: 'wise' }
  ];

 
  selectedPaymentMethod: PaymentMethod | null = null;

  // Dialog state
  showPayoutDialog = false;

  // Check if payout can be requested
  canRequestPayout(): boolean {
    return !!this.payoutRequest.amount && 
           this.payoutRequest.amount >= 10 && 
           this.payoutRequest.amount <= this.dashboardData.availableBalance &&
           !!this.payoutRequest.paymentMethod;
  }

  // Handle payout request
  onRequestPayout() {
    if (this.canRequestPayout()) {
      this.showPayoutDialog = true;
    }
  }

  // Confirm payout
  confirmPayout() {
    this.payoutRequest.status = 'processing';
    this.payoutRequest.statusMessage = 'Processing your payout request...';
    
    // Simulate API call
    setTimeout(() => {
      this.payoutRequest.status = 'success';
      this.payoutRequest.statusMessage = `Payout request of £${this.payoutRequest.amount} submitted successfully!`;
      
      // Update available balance
      this.dashboardData.availableBalance -= this.payoutRequest.amount || 0;
      
      // Reset form after success
      setTimeout(() => {
        this.resetPayoutForm();
      }, 3000);
      
    }, 2000);

    this.showPayoutDialog = false;
  }

  // Reset payout form
  resetPayoutForm() {
    this.payoutRequest = {
      amount: null,
      paymentMethod: '',
      status: 'idle',
      statusMessage: ''
    };
    this.selectedPaymentMethod = null;
  }

  // Get payment method label
  getPaymentMethodLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.payoutRequest.paymentMethod);
    return method ? method.label : '';
  }

  // Get payout status CSS class
  getPayoutStatusClass(): string {
    switch (this.payoutRequest.status) {
      case 'success':
        return 'bg-green-50 text-green-800 border border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border border-red-200';
      case 'processing':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      default:
        return '';
    }
  }

  // Get payout status icon
  getPayoutStatusIcon(): string {
    switch (this.payoutRequest.status) {
      case 'success':
        return 'pi pi-check-circle text-green-500';
      case 'error':
        return 'pi pi-times-circle text-red-500';
      case 'processing':
        return 'pi pi-spin pi-spinner text-blue-500';
      default:
        return '';
    }
  }

  // Existing methods
  onVerifyNow() {
    console.log('Navigate to verification page');
  }

  onUpdatePayout() {
    console.log('Navigate to payout settings');
  }

  refreshDashboard() {
    console.log('Refreshing dashboard data...');
  }
}