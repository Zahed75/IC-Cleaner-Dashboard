import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { 
  DashboardService, 
  DashboardStatistics, 
  DBAVerificationStatus, 
  PayoutRequest as APIPayoutRequest,
  Balance,
  TotalBalance,
  ApiResponse 
} from '../../../services/cleaner-service/dashboard/dashboard-service';

interface UIPayoutRequest {
  amount: number | null;
  paymentMethod: string;
  status: 'idle' | 'success' | 'error' | 'processing';
  statusMessage: string;
  notes?: string;
}

interface PaymentMethod {
  label: string;
  value: string;
  id: number;
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
    InputTextModule,
    ToastModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [MessageService]
})
export class CleanerDashboardComponent implements OnInit {
  // Dashboard data
  dashboardData = {
    userName: 'Cleaner',
    todayBookings: 0,
    completedToday: 0,
    todayRevenue: 0,
    availableBalance: 0,
    nextPayout: 0,
    payoutDate: this.getNextPayoutDate(),
    rating: 4.7, // Static rating data
    ratingPercentage: 94, // Static rating percentage
    totalReviews: 42 // Static total reviews
  };

  // API data
  statistics: DashboardStatistics | null = null;
  dbaStatus: DBAVerificationStatus | null = null;
  balance: Balance | null = null;
  totalBalance: TotalBalance | null = null;

  // Static rating data
  staticRatingData = {
    average_rating: 4.7,
    total_ratings: 42,
    breakdown: {
      '5_star': 25,
      '4_star': 12,
      '3_star': 3,
      '2_star': 1,
      '1_star': 1
    }
  };

  // Alert statuses
  alerts = {
    verificationRequired: false,
    payoutInfoRequired: false
  };

  // Payout request data
  payoutRequest: UIPayoutRequest = {
    amount: null,
    paymentMethod: '',
    status: 'idle',
    statusMessage: '',
    notes: 'Payout request'
  };

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    { label: 'PayPal', value: 'paypal', id: 1 },
    { label: 'Bank Transfer', value: 'bank_transfer', id: 2 },
    { label: 'Stripe', value: 'stripe', id: 3 }
  ];

  selectedPaymentMethod: PaymentMethod | null = null;
  loading = false;

  // Dialog state
  showPayoutDialog = false;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load all data in parallel
    this.dashboardService.getDashboardStatistics().subscribe({
      next: (response: ApiResponse<DashboardStatistics>) => {
        if (response.code === 200 && response.data) {
          this.statistics = response.data;
          this.updateDashboardData();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard statistics:', error);
        this.showError('Failed to load dashboard data');
        this.loading = false;
      }
    });

    this.dashboardService.getDBAVerificationStatus().subscribe({
      next: (response: ApiResponse<DBAVerificationStatus>) => {
        if (response.code === 200 && response.data) {
          this.dbaStatus = response.data;
          this.updateAlerts();
        }
      },
      error: (error: any) => {
        console.error('Error loading DBA status:', error);
      }
    });

    this.dashboardService.getBalance().subscribe({
      next: (response: ApiResponse<Balance>) => {
        if (response.code === 200 && response.data) {
          this.balance = response.data;
          this.updateBalanceData();
        }
      },
      error: (error: any) => {
        console.error('Error loading balance:', error);
      }
    });

    this.dashboardService.getTotalBalance().subscribe({
      next: (response: ApiResponse<TotalBalance>) => {
        if (response.code === 200 && response.data) {
          this.totalBalance = response.data;
          this.updateTotalBalanceData();
        }
      },
      error: (error: any) => {
        console.error('Error loading total balance:', error);
      }
    });
  }

  private updateDashboardData() {
    if (!this.statistics) return;

    const today = this.statistics.today_overview;
    const ratings = this.statistics.ratings;
    const quickStats = this.statistics.quick_stats;

    this.dashboardData.todayBookings = today.total_bookings;
    this.dashboardData.completedToday = today.completed_bookings;
    this.dashboardData.todayRevenue = today.revenue;

    // Update available balance from balance API if available
    if (this.balance) {
      this.dashboardData.availableBalance = this.balance.available_balance;
      this.dashboardData.nextPayout = Math.min(this.balance.available_balance, 500); // Example logic
    }
  }

  private updateBalanceData() {
    if (!this.balance) return;

    this.dashboardData.availableBalance = this.balance.available_balance;
    this.dashboardData.nextPayout = Math.min(this.balance.available_balance, 500);
  }

  private updateTotalBalanceData() {
    if (!this.totalBalance) return;

    // Use total balance if it's more comprehensive
    this.dashboardData.availableBalance = this.totalBalance.available_balance;
    this.dashboardData.nextPayout = Math.min(this.totalBalance.available_balance, 500);
  }

  private updateAlerts() {
    if (!this.dbaStatus) return;

    this.alerts.verificationRequired = !this.dbaStatus.dba_verified;
    this.alerts.payoutInfoRequired = !this.dbaStatus.has_dba_document;
  }

  private getNextPayoutDate(): string {
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
    return nextFriday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

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
    if (!this.payoutRequest.amount || !this.payoutRequest.paymentMethod) return;

    this.payoutRequest.status = 'processing';
    this.payoutRequest.statusMessage = 'Processing your payout request...';
    
    const payoutData: APIPayoutRequest = {
      payment_method: this.getPaymentMethodId(),
      amount: this.payoutRequest.amount.toFixed(2),
      notes: this.payoutRequest.notes || 'Payout request'
    };

    this.dashboardService.createPayout(payoutData).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 201) {
          this.payoutRequest.status = 'success';
          this.payoutRequest.statusMessage = `Payout request of £${this.payoutRequest.amount} submitted successfully!`;
          
          // Refresh balance data
          this.refreshBalanceData();
          
          this.showSuccess('Payout request submitted successfully!');
        } else {
          this.payoutRequest.status = 'error';
          this.payoutRequest.statusMessage = 'Failed to submit payout request';
          this.showError('Failed to submit payout request: ' + response.message);
        }
        
        // Reset form after delay
        setTimeout(() => {
          this.resetPayoutForm();
        }, 5000);
      },
      error: (error: any) => {
        console.error('Error creating payout:', error);
        this.payoutRequest.status = 'error';
        this.payoutRequest.statusMessage = 'Error processing payout request';
        this.showError('Failed to submit payout request. Please try again.');
        
        setTimeout(() => {
          this.resetPayoutForm();
        }, 5000);
      }
    });

    this.showPayoutDialog = false;
  }

  private getPaymentMethodId(): number {
    const method = this.paymentMethods.find(m => m.value === this.payoutRequest.paymentMethod);
    return method ? method.id : 1; // Default to PayPal if not found
  }

  private refreshBalanceData() {
    this.dashboardService.getBalance().subscribe({
      next: (response: ApiResponse<Balance>) => {
        if (response.code === 200 && response.data) {
          this.balance = response.data;
          this.updateBalanceData();
        }
      }
    });

    this.dashboardService.getTotalBalance().subscribe({
      next: (response: ApiResponse<TotalBalance>) => {
        if (response.code === 200 && response.data) {
          this.totalBalance = response.data;
          this.updateTotalBalanceData();
        }
      }
    });
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

  // Navigation methods
  onVerifyNow() {
    this.router.navigate(['/cleaner/settings']);
  }

  onUpdatePayout() {
    this.router.navigate(['/cleaner/settings']);
  }

  refreshDashboard() {
    this.loadDashboardData();
    this.showSuccess('Dashboard refreshed successfully!');
  }

  // Helper method for rating breakdown
  getRatingBreakdownValue(stars: number): number {
    // Use static data since we don't have API for ratings
    const breakdown = this.staticRatingData.breakdown;
    
    switch (stars) {
      case 5: return breakdown['5_star'];
      case 4: return breakdown['4_star'];
      case 3: return breakdown['3_star'];
      case 2: return breakdown['2_star'];
      case 1: return breakdown['1_star'];
      default: return 0;
    }
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