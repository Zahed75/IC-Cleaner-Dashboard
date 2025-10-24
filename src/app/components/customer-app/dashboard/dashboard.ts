import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../app/services/auth/auth-service';
import { DashboardService, DashboardStats, UpcomingCleaning } from '../../../services/customer-service/dashboard/dashboard-service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface Booking {
  id: string;
  customerName: string;
  cleaner: string;
  serviceType: string;
  date: string;
  time: string;
  dateTime: string;
  address: string;
  amount: string;
  status: string;
  originalData?: UpcomingCleaning;
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    CardModule, 
    TagModule, 
    DialogModule, 
    ButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class CustomerDashboardComponent implements OnInit {
  userName: string = 'John';
  upcomingCleanings: number = 0;
  pendingPayments: number = 0;
  totalCleanings: number = 0;
  todaysCleanings: number = 0;
  
  showBookingDialog: boolean = false;
  selectedBooking: Booking | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  upcomingBookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.first_name;
    }
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.updateDashboardStats(response.data);
          this.updateUpcomingBookings(response.data.upcoming_cleanings);
        } else {
          this.errorMessage = response.message || 'Failed to load dashboard data';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          // Optionally redirect to login
          // this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Error loading dashboard data. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  private updateDashboardStats(data: DashboardStats): void {
    this.totalCleanings = data.statistics.total_cleanings;
    this.pendingPayments = data.statistics.pending_payments;
    this.upcomingCleanings = data.statistics.upcoming_cleanings;
    this.todaysCleanings = data.statistics.todays_cleanings;
  }

  private updateUpcomingBookings(upcomingCleanings: UpcomingCleaning[]): void {
    this.upcomingBookings = upcomingCleanings.map(cleaning => ({
      id: `IC#${cleaning.id.toString().padStart(10, '0')}`,
      customerName: this.userName,
      cleaner: cleaning.cleaner_name || 'Not Assigned',
      serviceType: cleaning.service_name,
      date: this.formatDate(cleaning.booking_date),
      time: this.formatTime(cleaning.time_slot),
      dateTime: this.formatDateTime(cleaning.booking_date, cleaning.time_slot),
      address: cleaning.location,
      amount: `£${cleaning.total_amount.toFixed(2)}`,
      status: this.mapStatus(cleaning.status),
      originalData: cleaning
    }));
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('en-GB', options);
    } catch (error) {
      return dateString;
    }
  }

  private formatTime(timeString: string): string {
    try {
      const timeParts = timeString.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  }

  private formatDateTime(dateString: string, timeString: string): string {
    const date = this.formatDate(dateString);
    const time = this.formatTime(timeString);
    return `${date}, ${time}`;
  }

  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'scheduled': 'Scheduled',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status.toLowerCase()] || status;
  }

  showBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.showBookingDialog = true;
  }

  getStatusSeverity(status: string): any {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  bookCleaning(): void {
    console.log('Book cleaning clicked');
    
    // Check if user is authenticated before navigating
    if (this.authService.isAuthenticated()) {
      // Navigate to booking page and auto-open the booking form
      this.router.navigate(['/customer/bookings'], { 
        queryParams: { book: 'true' } 
      }).then(success => {
        if (!success) {
          console.error('Navigation failed - check your route configuration');
          this.errorMessage = 'Navigation failed. Please check your connection.';
        }
      }).catch(error => {
        console.error('Navigation error:', error);
        this.errorMessage = 'Unable to navigate to booking page.';
      });
    } else {
      this.errorMessage = 'Your session has expired. Please log in again.';
      // Optionally redirect to login page
      // this.router.navigate(['/login']);
    }
  }

  viewAllCleanings(): void {
    console.log('View all cleanings clicked');
    // Navigate to bookings page
    this.router.navigate(['/customer/bookings']);
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}