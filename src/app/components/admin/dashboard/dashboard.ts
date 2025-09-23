import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule, Card } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule, TableModule, TagModule, CardModule, TooltipModule, ConfirmDialogModule, Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [ConfirmationService, MessageService]
})
export class Dashboard {
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // Today's metrics data
  metrics = [
    { title: "Today's Bookings", value: "13", action: "View All", icon: "pi-calendar" },
    { title: "Today's Revenue", value: "£2,489.02", action: "View Report", icon: "pi-chart-bar" },
    { title: "Active Cleaners", value: "8", subValue: "43", action: "View All Cleaners", icon: "pi-users" },
    { title: "Pending Disputes", value: "3", action: "View Disputes", icon: "pi-exclamation-triangle" }
  ];

  // Status tag severity mapping
  statusSeverity: any = {
    'Payment Pending': 'warning',
    'Pending': 'secondary',
    'Scheduled': 'info',
    'Completed': 'success',
    'Cancelled': 'danger',
    'Processing': 'info'
  };

  // Recent bookings data
  recentBookings = [
    { 
      bookingId: "C#2508150010", 
      cleaner: "Joseph Tribblani", 
      service: "End-of-Tenancy", 
      dateTime: "15 Aug 2025, 10:00 AM", 
      amount: "£299.99", 
      status: "Payment Pending" 
    },
    { 
      bookingId: "C#2508150011", 
      cleaner: "Sarah Johnson", 
      service: "Airbnb / Holiday Let", 
      dateTime: "15 Aug 2025, 10:00 AM", 
      amount: "£299.99", 
      status: "Pending" 
    },
    { 
      bookingId: "C#2508150012", 
      cleaner: "Michael Brown", 
      service: "Office / HMO", 
      dateTime: "15 Aug 2025, 10:00 AM", 
      amount: "£299.99", 
      status: "Pending" 
    },
    { 
      bookingId: "C#2508150013", 
      cleaner: "Emily Wilson", 
      service: "Office / HMO", 
      dateTime: "15 Aug 2025, 10:00 AM", 
      amount: "£299.99", 
      status: "Scheduled" 
    }
  ];

  // Payouts data
  payouts = [
    { 
      payoutId: "C+12345", 
      cleaner: "John Smith", 
      method: "Bank Transfer", 
      amount: "£150.00", 
      status: "Completed" 
    },
    { 
      payoutId: "C+12346", 
      cleaner: "Emma Johnson", 
      method: "PayPal", 
      amount: "£200.00", 
      status: "Pending" 
    },
    { 
      payoutId: "C+12347", 
      cleaner: "Michael Brown", 
      method: "Bank Transfer", 
      amount: "£180.50", 
      status: "Processing" 
    }
  ];

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

  // Booking actions
  onViewBooking(booking: any) {
    console.log('View booking:', booking);
    this.messageService.add({severity: 'info', summary: 'View Booking', detail: `Viewing booking ${booking.bookingId}`});
  }

  onEditBooking(booking: any) {
    console.log('Edit booking:', booking);
    this.messageService.add({severity: 'info', summary: 'Edit Booking', detail: `Editing booking ${booking.bookingId}`});
  }

  onDeleteBooking(booking: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this booking?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete booking:', booking);
        this.messageService.add({severity: 'success', summary: 'Booking Deleted', detail: `Booking ${booking.bookingId} has been deleted`});
      }
    });
  }

  // Payout actions
  onViewPayout(payout: any) {
    console.log('View payout:', payout);
    this.messageService.add({severity: 'info', summary: 'View Payout', detail: `Viewing payout ${payout.payoutId}`});
  }

  onEditPayout(payout: any) {
    console.log('Edit payout:', payout);
    this.messageService.add({severity: 'info', summary: 'Edit Payout', detail: `Editing payout ${payout.payoutId}`});
  }

  onDeletePayout(payout: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this payout?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete payout:', payout);
        this.messageService.add({severity: 'success', summary: 'Payout Deleted', detail: `Payout ${payout.payoutId} has been deleted`});
      }
    });
  }
}