import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG standalone components for v20
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Steps } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

import { MessageService } from 'primeng/api';

interface Booking {
  id: string;
  customer: string;
  service: string;
  date: string;
  amount: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  address?: string;
  notes?: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Cleaner {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
}

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
    Steps
  ],
  providers: [MessageService],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class BookingsComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  bookingForm: FormGroup;
  currentStep: number = 0;
  steps: MenuItem[] = [
    { label: 'Information' },
    { label: 'Cleaner' },
    { label: 'Confirmation' }
  ];

  bookings: Booking[] = [
    {
      id: 'IC#2508150010',
      customer: 'Assign Cleaner',
      service: 'Office / HMO',
      date: '15 Aug 2025, 10:00 AM',
      amount: 299.99,
      status: 'Scheduled'
    },
    {
      id: 'IC#2508150011',
      customer: 'Chandler Bing',
      service: 'Regular Cleaning',
      date: '25 Aug 2025, 10:00 AM',
      amount: 165.00,
      status: 'Completed',
      address: '1 Chapel Hill, Heswall,\nBournemouth BH1 1AA',
      notes: 'Please bring extra cleaning supplies'
    },
    {
      id: 'IC#2508150015',
      customer: 'Phoebe Buffay',
      service: 'Regular Cleaning',
      date: '05 June 2025, 03:00 PM',
      amount: 199.99,
      status: 'Cancelled'
    }
  ];

  customers: Customer[] = [
    { id: 1, name: 'Chandler Bing' },
    { id: 2, name: 'Monica Geller' },
    { id: 3, name: 'Ross Geller' },
    { id: 4, name: 'Rachel Green' },
    { id: 5, name: 'Joey Tribbiani' },
    { id: 6, name: 'Phoebe Buffay' }
  ];

  serviceTypes: string[] = [
    'Standard Cleaning',
    'Regular Cleaning',
    'Office / HMO',
    'End-of-Tenancy',
    'Deep Cleaning'
  ];

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

  cleaners: Cleaner[] = [
    { id: 1, name: 'Monica Geller', rating: 4.7, completedJobs: 20 },
    { id: 2, name: 'Ross Geller', rating: 4.5, completedJobs: 5 },
    { id: 3, name: 'Phoebe Buffay', rating: 4.5, completedJobs: 10 },
    { id: 4, name: 'Joey Tribbiani', rating: 4.3, completedJobs: 10 }
  ];

  showBookingForm = false;
  showBookingDetailsDialog = false;
  selectedBooking: Booking | null = null;
  selectedCleaner: Cleaner | null = null;

  constructor() {
    this.bookingForm = this.fb.group({
      customer: [null, Validators.required],
      service: ['', Validators.required],
      date: [null, Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      requests: ['']
    });
  }

  showBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.showBookingDetailsDialog = true;
  }

  // Add the missing editBooking method
  editBooking() {
    this.showBookingDetailsDialog = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Edit Booking',
      detail: 'Edit functionality would be implemented here',
      life: 3000
    });
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

  confirmBooking() {
    if (!this.selectedCleaner) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a cleaner',
        life: 3000
      });
      return;
    }

    const formValue = this.bookingForm.value;
    const fresh: Booking = {
      id: 'IC#' + Date.now(),
      customer: formValue.customer?.name || 'Unknown Customer',
      service: formValue.service,
      date: this.formatDateTime(formValue.date, formValue.time),
      amount: this.calculateAmount(formValue.service),
      status: 'Scheduled',
      address: formValue.location,
      notes: formValue.requests
    };

    this.bookings.unshift(fresh);
    this.showBookingForm = false;
    this.resetForm();

    this.messageService.add({
      severity: 'success',
      summary: 'Booking Successful!',
      detail: 'New booking is placed successfully, and customer will be notified shortly.',
      life: 5000
    });
  }

  resetForm() {
    this.bookingForm.reset();
    this.currentStep = 0;
    this.selectedCleaner = null;
  }

  formatDateTime(date: Date | null, time: string): string {
    if (!date) return 'N/A';
    const datePart = date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    return `${datePart}, ${time}`;
  }

  calculateAmount(service: string): number {
    const baseAmounts: Record<string, number> = {
      'Standard Cleaning': 165,
      'Regular Cleaning': 199.99,
      'Office / HMO': 299.99,
      'End-of-Tenancy': 399.99,
      'Deep Cleaning': 349.99
    };
    return baseAmounts[service] ?? 199.99;
  }

  getDatePart(dateTime: string): string {
    return dateTime.split(',')[0];
  }

  getTimePart(dateTime: string): string {
    const parts = dateTime.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Completed': return 'success';
      case 'Scheduled': return 'info';
      case 'Cancelled': return 'danger';
      case 'In Progress': return 'warning';
      default: return 'secondary';
    }
  }
}