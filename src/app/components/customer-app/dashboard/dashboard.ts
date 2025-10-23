import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../app/services/auth/auth-service';
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
export class CustomerDashboardComponent {
  userName: string = 'John';
  upcomingCleanings: number = 1;
  pendingPayments: number = 1;
  totalCleanings: number = 15;
  
  showBookingDialog: boolean = false;
  selectedBooking: Booking | null = null;

  upcomingBookings: Booking[] = [
    {
      id: 'IC#2508150010',
      customerName: 'Chandler',
      cleaner: 'Joseph Tribblani',
      serviceType: 'Regular Cleaning',
      date: '25th August, 2025',
      time: '10:00 AM',
      dateTime: '25th August, 2025, 10:00 AM',
      address: '1 Chapel Hill, Heswall, Bournemouth BH1 1AA',
      amount: '£165.00',
      status: 'Scheduled'
    },
    {
      id: 'IC#2508150011',
      customerName: 'Monica',
      cleaner: 'Rachel Green',
      serviceType: 'Deep Cleaning',
      date: '26th August, 2025',
      time: '2:00 PM',
      dateTime: '26th August, 2025, 2:00 PM',
      address: '90 Bedford Street, New York, NY 10014',
      amount: '£220.00',
      status: 'Confirmed'
    }
  ];

  constructor(private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.first_name;
    }
  }

  showBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.showBookingDialog = true;
  }

  getStatusSeverity(status: string): any {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  editBooking(booking: Booking): void {
    console.log('Edit booking:', booking);
    this.showBookingDialog = false;
    // Navigate to edit booking page
  }

  cancelBooking(booking: Booking): void {
    console.log('Cancel booking:', booking);
    this.showBookingDialog = false;
    // Implement cancel booking logic
  }

  viewAllCleanings(): void {
    console.log('View all cleanings clicked');
    // Navigate to bookings page
  }

  bookCleaning(): void {
    console.log('Book cleaning clicked');
    // Navigate to booking page
  }
}