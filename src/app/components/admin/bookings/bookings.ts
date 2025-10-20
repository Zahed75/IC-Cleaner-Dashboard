// src/app/components/admin/bookings/bookings.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG standalone components for v20
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Steps } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

import { MessageService } from 'primeng/api';
import { 
  BookingManagementService, 
  Booking, 
  Customer, 
  Cleaner,
  CreateBookingRequest,
  UpdateBookingRequest
} from '../../../services/booking/booking-management';
import { ServiceManagementService, Service } from '../../../services/services/service-management';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    Card,
    TableModule,
    Tag,
    Dialog,
    Toast,
    Select,
    DatePicker,
    Steps,
    ProgressSpinner
  ],
  providers: [MessageService],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class BookingsComponent implements OnInit {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingManagementService);
  private serviceManagementService = inject(ServiceManagementService);

  bookingForm: FormGroup;
  currentStep: number = 0;
  steps: MenuItem[] = [
    { label: 'Information' },
    { label: 'Cleaner' },
    { label: 'Confirmation' }
  ];

  bookings: Booking[] = [];
  customers: Customer[] = [];
  services: Service[] = [];
  cleaners: Cleaner[] = [];
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;

  timeSlots: string[] = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM'
  ];

  locations: string[] = [
    '1 Chapel Hill, Heswall, Bournemouth BH1 1AA',
    '23 Park Avenue, London W1 2BQ',
    '45 Riverside Drive, Manchester M15 3CD',
    '78 High Street, Birmingham B2 4EF'
  ];

  showBookingForm = false;
  showBookingDetailsDialog = false;
  selectedBooking: Booking | null = null;
  selectedCleaner: Cleaner | null = null;

  constructor() {
    this.bookingForm = this.fb.group({
      customer: [null, Validators.required],
      service: [null, Validators.required],
      date: [null, Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      special_requirements: ['']
    });
  }

  ngOnInit() {
    this.loadBookings();
    this.loadCustomers();
    this.loadServices();
    this.loadCleaners();
  }

  // Load all bookings from API
  loadBookings() {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading bookings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load bookings',
          life: 5000
        });
        this.isLoading = false;
      }
    });
  }

  // Load customers from API
  loadCustomers() {
    this.bookingService.getCustomers().subscribe({
      next: (response: any) => {
        this.customers = response.data;
      },
      error: (error: any) => {
        console.error('Error loading customers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load customers',
          life: 5000
        });
      }
    });
  }

  // Load services from API
  loadServices() {
    this.serviceManagementService.getServices().subscribe({
      next: (response: any) => {
        this.services = response.data;
      },
      error: (error: any) => {
        console.error('Error loading services:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load services',
          life: 5000
        });
      }
    });
  }

  // Load cleaners from API
  loadCleaners() {
    this.bookingService.getCleaners().subscribe({
      next: (response: any) => {
        this.cleaners = response.data;
      },
      error: (error: any) => {
        console.error('Error loading cleaners:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load cleaners',
          life: 5000
        });
      }
    });
  }

  showBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.showBookingDetailsDialog = true;
  }

  // Open edit booking form
  editBooking() {
    if (!this.selectedBooking) return;

    this.isEditMode = true;
    this.showBookingDetailsDialog = false;
    
    // Find the customer object
    const customer = this.customers.find(c => c.id === this.selectedBooking!.customer);
    
    // Find the service object
    const service = this.services.find(s => s.id === this.selectedBooking!.service);
    
    // Find the cleaner object if assigned
    if (this.selectedBooking.assign_cleaner) {
      this.selectedCleaner = this.cleaners.find(c => c.id === this.selectedBooking!.assign_cleaner) || null;
    }

    // Parse the time from API format to display format
    const displayTime = this.bookingService.parseTimeFromAPI(this.selectedBooking.time_slot);

    // Pre-fill the form with existing booking data
    this.bookingForm.patchValue({
      customer: customer,
      service: service,
      date: new Date(this.selectedBooking.booking_date),
      time: displayTime,
      location: this.selectedBooking.location,
      special_requirements: this.selectedBooking.special_requirements
    });

    this.showBookingForm = true;
    this.currentStep = 0;
  }

  nextStep() {
    if (this.currentStep === 0) {
      if (this.bookingForm.get('customer')?.invalid || 
          this.bookingForm.get('service')?.invalid || 
          this.bookingForm.get('date')?.invalid || 
          this.bookingForm.get('time')?.invalid || 
          this.bookingForm.get('location')?.invalid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Please fill all required fields',
          life: 3000
        });
        return;
      }
    }
    
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  selectCleaner(cleaner: Cleaner) {
    this.selectedCleaner = cleaner;
  }

  // Save booking (both create and update)
  saveBooking() {
    if (this.isEditMode) {
      this.updateBooking();
    } else {
      this.createBooking();
    }
  }

  // Create new booking
  createBooking() {
    if (!this.selectedCleaner) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a cleaner',
        life: 3000
      });
      return;
    }

    if (this.bookingForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.bookingForm.value;

    const bookingData: CreateBookingRequest = {
      customer: formValue.customer.id,
      service: formValue.service.id,
      booking_date: this.bookingService.formatDateForAPI(formValue.date),
      time_slot: this.bookingService.formatTimeForAPI(formValue.time),
      location: formValue.location,
      special_requirements: formValue.special_requirements || ''
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.showBookingForm = false;
        this.loadBookings(); // Reload bookings list
        this.resetForm();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Booking Successful!',
          detail: response.message,
          life: 5000
        });
      },
      error: (error: any) => {
        console.error('Error creating booking:', error);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Booking Failed',
          detail: error.message || 'Failed to create booking',
          life: 5000
        });
      }
    });
  }

  // Update existing booking
  updateBooking() {
    if (!this.selectedBooking) return;

    if (this.bookingForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.bookingForm.value;

    const bookingData: UpdateBookingRequest = {
      customer: formValue.customer.id,
      service: formValue.service.id,
      booking_date: this.bookingService.formatDateForAPI(formValue.date),
      time_slot: this.bookingService.formatTimeForAPI(formValue.time),
      special_requirements: formValue.special_requirements || '',
      location: formValue.location
    };

    this.bookingService.updateBooking(this.selectedBooking.id, bookingData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.showBookingForm = false;
        this.loadBookings(); // Reload bookings list
        this.resetForm();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Booking Updated!',
          detail: response.message,
          life: 5000
        });
      },
      error: (error: any) => {
        console.error('Error updating booking:', error);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: error.message || 'Failed to update booking',
          life: 5000
        });
      }
    });
  }

  resetForm() {
    this.bookingForm.reset();
    this.currentStep = 0;
    this.selectedCleaner = null;
    this.isEditMode = false;
    this.selectedBooking = null;
  }

  // Open add booking form
  openAddBooking() {
    this.isEditMode = false;
    this.selectedBooking = null;
    this.selectedCleaner = null;
    this.bookingForm.reset();
    this.showBookingForm = true;
    this.currentStep = 0;
  }

  formatDateTime(date: Date | null, time: string): string {
    if (!date) return 'N/A';
    const datePart = date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    return `${datePart}, ${time}`;
  }

  getDatePart(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  getTimePart(dateTime: string): string {
    // Handle both API time format and display format
    if (dateTime.includes(':')) {
      const timePart = dateTime.split(' ')[1];
      if (timePart) {
        return timePart;
      }
    }
    return this.bookingService.parseTimeFromAPI(dateTime);
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'in_progress':
        return 'secondary';
      case 'confirmed':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  // Helper to get customer full name
  getCustomerFullName(booking: Booking): string {
    if (booking.customer_detail) {
      return `${booking.customer_detail.first_name} ${booking.customer_detail.last_name}`.trim();
    }
    return booking.customer_name || 'Unknown Customer';
  }

  // Helper to get service name
  getServiceName(booking: Booking): string {
    return booking.service_detail?.name || 'Unknown Service';
  }

  // Helper to get cleaner full name
  getCleanerFullName(cleaner: Cleaner): string {
    return `${cleaner.first_name} ${cleaner.last_name}`.trim();
  }

  // Helper to get cleaner rating
  getCleanerRating(cleaner: Cleaner): number {
    return parseFloat(cleaner.profile.rating) || 0;
  }

  // Helper to get cleaner completed jobs
  getCleanerCompletedJobs(cleaner: Cleaner): number {
    return cleaner.profile.total_services_done || 0;
  }

  // Calculate amount based on service (you can modify this based on your pricing logic)
  calculateAmount(service: any): number {
    if (!service) return 0;
    // You can implement your pricing logic here based on service type
    return parseFloat(service.price_per_hour) || 0;
  }
}