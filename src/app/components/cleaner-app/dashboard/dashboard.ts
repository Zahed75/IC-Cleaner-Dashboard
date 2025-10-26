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
  ApiResponse,
  MyRatingsResponse,
  RatingStatistics
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
    rating: 0,
    ratingPercentage: 0,
    totalReviews: 0
  };

  // API data
  statistics: DashboardStatistics | null = null;
  dbaStatus: DBAVerificationStatus | null = null;
  balance: Balance | null = null;
  totalBalance: TotalBalance | null = null;
  ratingsData: RatingStatistics | null = null;

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

  // DBA Upload status
  dbaUploadStatus: 'idle' | 'success' | 'error' | 'processing' = 'idle';
  dbaUploadStatusMessage: string = '';
  selectedDBAFile: File | null = null;
  showDBAAlert: boolean = true;

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    { label: 'PayPal', value: 'paypal', id: 1 },
    { label: 'Bank Transfer', value: 'bank_transfer', id: 2 },
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

    // Load DBA verification status
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

    // Load ratings data
    this.dashboardService.getMyRatings().subscribe({
      next: (response: ApiResponse<MyRatingsResponse>) => {
        if (response.code === 200 && response.data) {
          this.ratingsData = response.data.statistics;
          this.updateRatingsData();
        }
      },
      error: (error: any) => {
        console.error('Error loading ratings:', error);
        // Use static data as fallback if API fails
        this.useStaticRatingsData();
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

  // DBA File Upload Methods
  onDBAFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!allowedTypes.includes(file.type)) {
        this.showError('Please select a valid file (PDF, DOC, DOCX, JPG, PNG)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.showError('File size should be less than 10MB');
        return;
      }

      this.selectedDBAFile = file;
      this.uploadDBADocument();
    }
  }

  uploadDBADocument() {
    if (!this.selectedDBAFile) return;

    this.dbaUploadStatus = 'processing';
    this.dbaUploadStatusMessage = 'Uploading DBA document...';

    this.dashboardService.uploadDBADocument(this.selectedDBAFile).subscribe({
      next: (response: any) => {
        this.dbaUploadStatus = 'success';
        this.dbaUploadStatusMessage = 'DBA document uploaded successfully! Under verification.';
        
        this.showSuccess('DBA document uploaded successfully! It will be verified shortly.');
        
        // Refresh DBA status after successful upload
        setTimeout(() => {
          this.loadDashboardData();
        }, 2000);

        // Reset file input
        const fileInput = document.getElementById('dbaFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error: any) => {
        console.error('Error uploading DBA document:', error);
        this.dbaUploadStatus = 'error';
        this.dbaUploadStatusMessage = 'Failed to upload DBA document. Please try again.';
        this.showError('Failed to upload DBA document');
      }
    });
  }

  // DBA Alert Methods
  dismissDBAAlert() {
    this.showDBAAlert = false;
  }

  // onLearnMoreDBA() {
  //   // You can navigate to a help page or show a dialog with more information
  //   this.router.navigate(['/cleaner/help'], { queryParams: { section: 'dba-verification' } });
  // }

  getDBAUploadStatusClass(): string {
    switch (this.dbaUploadStatus) {
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

  getDBAUploadStatusIcon(): string {
    switch (this.dbaUploadStatus) {
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

  private updateDashboardData() {
    if (!this.statistics) return;

    const today = this.statistics.today_overview;
    const quickStats = this.statistics.quick_stats;

    this.dashboardData.todayBookings = today.total_bookings;
    this.dashboardData.completedToday = today.completed_bookings;
    this.dashboardData.todayRevenue = today.revenue;

    // Update available balance from balance API if available
    if (this.balance) {
      this.dashboardData.availableBalance = this.balance.available_balance;
      this.dashboardData.nextPayout = Math.min(this.balance.available_balance, 500);
    }
  }

  private updateRatingsData() {
    if (!this.ratingsData) return;

    this.dashboardData.rating = this.ratingsData.average_rating;
    this.dashboardData.ratingPercentage = (this.ratingsData.average_rating / 5) * 100;
    this.dashboardData.totalReviews = this.ratingsData.total_ratings;
  }

  private useStaticRatingsData() {
    // Fallback static data if API fails
    this.dashboardData.rating = 4.7;
    this.dashboardData.ratingPercentage = 94;
    this.dashboardData.totalReviews = 42;
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
    if (!this.ratingsData?.rating_breakdown) {
      // Fallback to static data if no ratings data
      const staticData = {
        5: 25,
        4: 12,
        3: 3,
        2: 1,
        1: 1
      };
      return staticData[stars as keyof typeof staticData] || 0;
    }
    
    const breakdown = this.ratingsData.rating_breakdown;
    
    switch (stars) {
      case 5: return breakdown['5_star'].count;
      case 4: return breakdown['4_star'].count;
      case 3: return breakdown['3_star'].count;
      case 2: return breakdown['2_star'].count;
      case 1: return breakdown['1_star'].count;
      default: return 0;
    }
  }

  // Helper method to get rating percentage for progress bar
  getRatingPercentage(stars: number): number {
    if (!this.ratingsData?.rating_breakdown || this.ratingsData.total_ratings === 0) {
      // Fallback percentages if no data
      const staticPercentages = {
        5: 59.5,
        4: 28.6,
        3: 7.1,
        2: 2.4,
        1: 2.4
      };
      return staticPercentages[stars as keyof typeof staticPercentages] || 0;
    }
    
    const breakdown = this.ratingsData.rating_breakdown;
    
    switch (stars) {
      case 5: return breakdown['5_star'].percentage;
      case 4: return breakdown['4_star'].percentage;
      case 3: return breakdown['3_star'].percentage;
      case 2: return breakdown['2_star'].percentage;
      case 1: return breakdown['1_star'].percentage;
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