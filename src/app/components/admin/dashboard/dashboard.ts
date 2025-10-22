import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule, Card } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DashboardService, DashboardOverview, QuickStats, RecentBooking, RecentPayout } from '../../../services/dashboard/dashboard-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    ButtonModule, 
    TableModule, 
    TagModule, 
    CardModule, 
    TooltipModule, 
    ConfirmDialogModule, 
    Card,
    ToastModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [ConfirmationService, MessageService]
})
export class Dashboard implements OnInit {
  // Today's metrics data
  metrics = [
    { title: "Today's Bookings", value: "0", action: "View All", icon: "pi-calendar", route: "/booking" },
    { title: "Today's Revenue", value: "£0.00", action: "View Report", icon: "pi-chart-bar", route: "/reports" },
    { title: "Active Cleaners", value: "0", subValue: "0", action: "View All Cleaners", icon: "pi-users", route: "/cleaners" },
    { title: "Pending Disputes", value: "0", action: "View Disputes", icon: "pi-exclamation-triangle", route: "/disputes" }
  ];

  // Status tag severity mapping
  statusSeverity: any = {
    'pending': 'warning',
    'completed': 'success',
    'approved': 'info',
    'paid': 'success',
    'rejected': 'danger',
    'Payment Pending': 'warning',
    'Pending': 'secondary',
    'Scheduled': 'info',
    'Completed': 'success',
    'Cancelled': 'danger',
    'Processing': 'info'
  };

  recentBookings: RecentBooking[] = [];
  payouts: RecentPayout[] = [];
  loading = false;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load overview data
    this.dashboardService.getDashboardOverview().subscribe({
      next: (response) => {
        const dashboardData = response.data;
        this.updateMetrics(dashboardData.todays_metrics);
        this.recentBookings = dashboardData.recent_bookings;
        this.payouts = dashboardData.recent_payouts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard data'
        });
        this.loading = false;
      }
    });

    // Load quick stats for additional data
    this.dashboardService.getQuickStats().subscribe({
      next: (response) => {
        const quickStats = response.data;
        this.updateMetricsWithQuickStats(quickStats);
      },
      error: (error) => {
        console.error('Error loading quick stats:', error);
      }
    });
  }

  updateMetrics(todaysMetrics: any): void {
    this.metrics[0].value = todaysMetrics.todays_bookings.toString();
    this.metrics[1].value = todaysMetrics.todays_revenue_formatted;
    this.metrics[2].value = todaysMetrics.active_cleaners.toString();
    this.metrics[2].subValue = todaysMetrics.active_cleaners.toString();
    this.metrics[3].value = todaysMetrics.pending_disputes.toString();
  }

  updateMetricsWithQuickStats(quickStats: any): void {
    // Update active cleaners with total count from quick stats
    this.metrics[2].subValue = quickStats.total_active_cleaners.toString();
  }

  // Click handler for booking IDs
  onBookingClick(bookingId: string) {
    console.log('Booking clicked:', bookingId);
    // Navigate to booking details page
    // this.router.navigate(['/bookings', bookingId]);
  }

  // Click handler for cleaner names
  onCleanerClick(cleanerName: string) {
    console.log('Cleaner clicked:', cleanerName);
    // Navigate to cleaner details page
    // this.router.navigate(['/cleaners', cleanerName]);
  }

  // Click handler for payout IDs
  onPayoutClick(payoutId: string) {
    console.log('Payout clicked:', payoutId);
    // Navigate to payout details page
    // this.router.navigate(['/payouts', payoutId]);
  }

  // Metric action handler
  onMetricAction(metric: any) {
    if (metric.route) {
      this.router.navigate([metric.route]);
    }
  }

  // Booking actions
  onViewBooking(booking: RecentBooking) {
    console.log('View booking:', booking);
    this.messageService.add({
      severity: 'info', 
      summary: 'View Booking', 
      detail: `Viewing booking #${booking.id}`
    });
  }

  onEditBooking(booking: RecentBooking) {
    console.log('Edit booking:', booking);
    this.messageService.add({
      severity: 'info', 
      summary: 'Edit Booking', 
      detail: `Editing booking #${booking.id}`
    });
  }

  onDeleteBooking(booking: RecentBooking) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this booking?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete booking:', booking);
        this.messageService.add({
          severity: 'success', 
          summary: 'Booking Deleted', 
          detail: `Booking #${booking.id} has been deleted`
        });
      }
    });
  }

  // Payout actions
  onViewPayout(payout: RecentPayout) {
    console.log('View payout:', payout);
    this.messageService.add({
      severity: 'info', 
      summary: 'View Payout', 
      detail: `Viewing payout ${payout.payout_id}`
    });
  }

  onEditPayout(payout: RecentPayout) {
    console.log('Edit payout:', payout);
    this.messageService.add({
      severity: 'info', 
      summary: 'Edit Payout', 
      detail: `Editing payout ${payout.payout_id}`
    });
  }

  onDeletePayout(payout: RecentPayout) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this payout?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete payout:', payout);
        this.messageService.add({
          severity: 'success', 
          summary: 'Payout Deleted', 
          detail: `Payout ${payout.payout_id} has been deleted`
        });
      }
    });
  }

  // Helper methods for template
  formatBookingId(booking: RecentBooking): string {
    return `B#${booking.id.toString().padStart(8, '0')}`;
  }

  formatDateTime(booking: RecentBooking): string {
    const date = new Date(booking.booking_date);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return `${formattedDate}, ${booking.time_slot}`;
  }

  formatAmount(amount: number): string {
    return `£${amount.toFixed(2)}`;
  }

  getBookingStatusDisplay(booking: RecentBooking): string {
    return booking.status_display || booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  }

  getPayoutStatusDisplay(payout: RecentPayout): string {
    return payout.status_display || payout.status.charAt(0).toUpperCase() + payout.status.slice(1);
  }

  getCleanerDisplayName(cleanerName: string): string {
    return cleanerName === 'Not Assigned' ? 'Not Assigned' : cleanerName;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing',
      detail: 'Dashboard data is being refreshed'
    });
  }
}