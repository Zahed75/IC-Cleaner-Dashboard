import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface Booking {
  id: string;
  clientName: string;
  serviceType: string;
  date: Date;
  time: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  address: string;
  postcode: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class CleanerBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading: boolean = false;
  showDetailsDialog: boolean = false;
  showConfirmDialog: boolean = false;
  selectedBooking: Booking | null = null;
  
  // Confirmation dialog properties
  confirmMessage: string = '';
  confirmActionText: string = '';
  confirmButtonClass: string = '';
  pendingAction: ((booking: Booking) => void) | null = null;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.bookings = [
        {
          id: 'BK001',
          clientName: 'Sarah Johnson',
          serviceType: 'Regular Cleaning',
          date: new Date('2025-10-25'),
          time: '10:00 AM',
          amount: 165.00,
          status: 'Pending',
          address: '1 Chapel Hill, Heswall, Bournemouth',
          postcode: 'BH1 1AA'
        },
        {
          id: 'BK002',
          clientName: 'Michael Brown',
          serviceType: 'Deep Cleaning',
          date: new Date('2025-10-26'),
          time: '2:00 PM',
          amount: 220.00,
          status: 'Confirmed',
          address: '23 Park Avenue, London',
          postcode: 'W1 1AB'
        },
        {
          id: 'BK003',
          clientName: 'Emma Wilson',
          serviceType: 'Regular Cleaning',
          date: new Date('2025-10-27'),
          time: '9:00 AM',
          amount: 145.00,
          status: 'Completed',
          address: '45 River Side, Manchester',
          postcode: 'M1 2CD'
        },
        {
          id: 'BK004',
          clientName: 'David Smith',
          serviceType: 'Move-in Cleaning',
          date: new Date('2025-10-28'),
          time: '11:00 AM',
          amount: 280.00,
          status: 'Pending',
          address: '78 High Street, Birmingham',
          postcode: 'B1 3EF'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  showBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.showDetailsDialog = true;
  }

  onDialogHide() {
    this.selectedBooking = null;
  }

  acceptBooking(booking: Booking) {
    this.confirmMessage = `Are you sure you want to accept booking #${booking.id}?`;
    this.confirmActionText = 'Accept';
    this.confirmButtonClass = 'bg-green-600 hover:bg-green-700 text-white';
    this.pendingAction = this.performAcceptBooking;
    this.selectedBooking = booking;
    this.showConfirmDialog = true;
  }

  rejectBooking(booking: Booking) {
    this.confirmMessage = `Are you sure you want to reject booking #${booking.id}?`;
    this.confirmActionText = 'Reject';
    this.confirmButtonClass = 'bg-red-600 hover:bg-red-700 text-white';
    this.pendingAction = this.performRejectBooking;
    this.selectedBooking = booking;
    this.showConfirmDialog = true;
  }

  confirmAction() {
    if (this.pendingAction && this.selectedBooking) {
      this.pendingAction(this.selectedBooking);
    }
    this.showConfirmDialog = false;
    this.pendingAction = null;
  }

  private performAcceptBooking(booking: Booking) {
    booking.status = 'Confirmed';
    this.showDetailsDialog = false;
    // Here you would typically make an API call to update the booking status
    console.log('Booking accepted:', booking.id);
  }

  private performRejectBooking(booking: Booking) {
    booking.status = 'Rejected';
    this.showDetailsDialog = false;
    // Here you would typically make an API call to update the booking status
    console.log('Booking rejected:', booking.id);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusInfoClass(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Completed':
        return 'bg-green-50 text-green-800 border border-green-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-50 text-red-800 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'pi pi-check-circle text-blue-500';
      case 'Completed':
        return 'pi pi-check-circle text-green-500';
      case 'Cancelled':
      case 'Rejected':
        return 'pi pi-times-circle text-red-500';
      default:
        return 'pi pi-info-circle text-gray-500';
    }
  }

  getStatusMessage(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'Booking Confirmed';
      case 'Completed':
        return 'Service Completed';
      case 'Cancelled':
        return 'Booking Cancelled';
      case 'Rejected':
        return 'Booking Rejected';
      default:
        return 'Pending Confirmation';
    }
  }

  getStatusDescription(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'This booking has been confirmed and is scheduled.';
      case 'Completed':
        return 'This service has been successfully completed.';
      case 'Cancelled':
        return 'This booking was cancelled.';
      case 'Rejected':
        return 'This booking was rejected.';
      default:
        return 'Waiting for your confirmation.';
    }
  }
}