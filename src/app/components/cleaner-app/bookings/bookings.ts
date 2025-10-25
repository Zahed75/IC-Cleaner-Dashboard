import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { BookingService, CleanerBooking, BookingStatusUpdate, ApiResponse } from '../../../services/cleaner-service/bookings/booking-service';

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
  originalData?: CleanerBooking; // Store original API data
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css'],
  providers: [MessageService]
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

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getCleanerBookings().subscribe({
      next: (response: ApiResponse<CleanerBooking[]>) => {
        if (response.code === 200 && response.data) {
          this.bookings = response.data.map(booking => this.mapApiBookingToUI(booking));
        } else {
          this.showError('Failed to load bookings: ' + response.message);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.showError('Failed to load bookings. Please try again.');
        this.loading = false;
      }
    });
  }

  private mapApiBookingToUI(apiBooking: CleanerBooking): Booking {
    // Map API status to UI status
    const statusMap: { [key: string]: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected' } = {
      'pending': 'Pending',
      'accepted': 'Confirmed',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'rejected': 'Rejected'
    };

    // Calculate amount from service price (you might need to adjust this based on your pricing logic)
    const amount = apiBooking.amount || 150.00; // Default amount if not provided

    return {
      id: `BK${apiBooking.booking_id.toString().padStart(3, '0')}`,
      clientName: 'Customer', // You might want to get this from customer details
      serviceType: apiBooking.service_name,
      date: new Date(apiBooking.booking_date),
      time: this.formatTime(apiBooking.time_slot),
      amount: amount,
      status: statusMap[apiBooking.status.toLowerCase()] || 'Pending',
      address: 'Address not available', // You might want to get this from booking details
      postcode: 'Postcode not available', // You might want to get this from booking details
      originalData: apiBooking
    };
  }

  private formatTime(timeString: string): string {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
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

  completeBooking(booking: Booking) {
    this.confirmMessage = `Are you sure you want to mark booking #${booking.id} as completed?`;
    this.confirmActionText = 'Complete';
    this.confirmButtonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
    this.pendingAction = this.performCompleteBooking;
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
    if (!booking.originalData) return;

    const statusUpdate: BookingStatusUpdate = { status: 'accepted' };
    
    this.bookingService.updateBookingStatus(booking.originalData.booking_id, statusUpdate).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          booking.status = 'Confirmed';
          this.showSuccess('Booking accepted successfully!');
          this.showDetailsDialog = false;
          this.loadBookings(); // Reload to get updated data
        } else {
          this.showError('Failed to accept booking: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error accepting booking:', error);
        this.showError('Failed to accept booking. Please try again.');
      }
    });
  }

  private performRejectBooking(booking: Booking) {
    if (!booking.originalData) return;

    const statusUpdate: BookingStatusUpdate = { status: 'rejected' };
    
    this.bookingService.updateBookingStatus(booking.originalData.booking_id, statusUpdate).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          booking.status = 'Rejected';
          this.showSuccess('Booking rejected successfully!');
          this.showDetailsDialog = false;
          this.loadBookings(); // Reload to get updated data
        } else {
          this.showError('Failed to reject booking: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error rejecting booking:', error);
        this.showError('Failed to reject booking. Please try again.');
      }
    });
  }

  private performCompleteBooking(booking: Booking) {
    if (!booking.originalData) return;

    const statusUpdate: BookingStatusUpdate = { status: 'completed' };
    
    this.bookingService.updateBookingStatus(booking.originalData.booking_id, statusUpdate).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          booking.status = 'Completed';
          this.showSuccess('Booking marked as completed successfully!');
          this.showDetailsDialog = false;
          this.loadBookings(); // Reload to get updated data
        } else {
          this.showError('Failed to complete booking: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error completing booking:', error);
        this.showError('Failed to complete booking. Please try again.');
      }
    });
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

  // Helper method to check if booking can be completed
  canCompleteBooking(booking: Booking): boolean {
    return booking.status === 'Confirmed' || booking.status === 'Pending';
  }
}