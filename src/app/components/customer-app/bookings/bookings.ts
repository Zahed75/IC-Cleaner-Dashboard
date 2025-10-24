import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

interface Booking {
  id: string;
  cleaner: string;
  service: string;
  dateTime: string;
  amount: string;
  status: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

interface Cleaner {
  id: number;
  name: string;
  completedJobs: number;
  rating: number;
}

interface Card {
  id: number;
  type: string;
  lastFour: string;
  expiry: string;
}

interface MenuItem {
  label: string;
  command?: () => void;
}

@Component({
  selector: 'customer-app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    TableModule,
    CardModule,
    TagModule,
    StepsModule,
    ListboxModule,
    AutoCompleteModule,
    InputTextModule,
    DatePickerModule
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class CustomerBookingsComponent {
  // Bookings Data
  bookings: Booking[] = [
    {
      id: 'IC#2508150010',
      cleaner: 'Chandler Bing',
      service: 'Office / HMO',
      dateTime: '15 Aug 2025, 10:00 AM',
      amount: '£299.99',
      status: 'Pending'
    },
    {
      id: 'IC#2508150011',
      cleaner: 'Chandler Bing',
      service: 'Office / HMO',
      dateTime: '15 Aug 2025, 10:00 AM',
      amount: '£299.99',
      status: 'Scheduled'
    },
    {
      id: 'IC#2508150012',
      cleaner: 'Ross Geller',
      service: 'End-of-Tenancy',
      dateTime: '10 Jul 2025, 03:00 PM',
      amount: '£399.99',
      status: 'Completed'
    },
    {
      id: 'IC#2508150013',
      cleaner: 'Joey Tribblani',
      service: 'Regular Cleaning',
      dateTime: '31 May 2025, 10:00 AM',
      amount: '£199.99',
      status: 'Cancelled'
    }
  ];

  // Dialog States
  showBookingDialog: boolean = false;
  showBookingFormDialog: boolean = false;

  // Multi-step form
  steps: MenuItem[] = [
    { label: 'Service Details' },
    { label: 'Choose Cleaner' },
    { label: 'Payment' }
  ];
  currentStepIndex: number = 0;

  // Selected Items
  selectedBooking: Booking | null = null;
  selectedLocation: Location | null = null;
  selectedServiceType: string = '';
  selectedDate: Date | null = null;
  selectedTime: string = '';
  selectedCleaner: Cleaner | null = null;
  selectedCard: Card | null = null;

  // Form Data
  locationInput: string = '';
  specialRequests: string = '';
  minDate: Date = new Date();

  // Dropdown Options - Convert to objects for PrimeNG dropdown
  serviceTypes: any[] = [
    { label: 'Standard Cleaning', value: 'Standard Cleaning' },
    { label: 'Deep Cleaning', value: 'Deep Cleaning' },
    { label: 'Office / HMO', value: 'Office / HMO' },
    { label: 'End-of-Tenancy', value: 'End-of-Tenancy' },
    { label: 'Regular Cleaning', value: 'Regular Cleaning' },
    { label: 'Move In/Out Cleaning', value: 'Move In/Out Cleaning' }
  ];

  availableTimes: any[] = [
    { label: '08:00 AM', value: '08:00 AM' },
    { label: '09:00 AM', value: '09:00 AM' },
    { label: '10:00 AM', value: '10:00 AM' },
    { label: '11:00 AM', value: '11:00 AM' },
    { label: '12:00 PM', value: '12:00 PM' },
    { label: '01:00 PM', value: '01:00 PM' },
    { label: '02:00 PM', value: '02:00 PM' },
    { label: '03:00 PM', value: '03:00 PM' },
    { label: '04:00 PM', value: '04:00 PM' },
    { label: '05:00 PM', value: '05:00 PM' }
  ];

  availableCleaners: Cleaner[] = [
    {
      id: 1,
      name: 'Monica Geller',
      completedJobs: 20,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Rhode Buffay',
      completedJobs: 10,
      rating: 4.5
    },
    {
      id: 3,
      name: 'Ross Geller',
      completedJobs: 5,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Joey Tribbiani',
      completedJobs: 10,
      rating: 4.3
    }
  ];

  savedCards: Card[] = [
    {
      id: 1,
      type: 'VISA',
      lastFour: '4242',
      expiry: '05/2028'
    },
    {
      id: 2,
      type: 'VISA',
      lastFour: '1234',
      expiry: '05/2030'
    }
  ];

  // Booking Details Methods
  showBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.showBookingDialog = true;
  }

  getStatusSeverity(status: string): any {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  editBooking(booking: Booking): void {
    console.log('Edit booking:', booking);
    this.showBookingDialog = false;
    // Implement edit booking logic
  }

  cancelBooking(booking: Booking): void {
    console.log('Cancel booking:', booking);
    this.showBookingDialog = false;
    // Implement cancel booking logic
  }

  // Multi-step Form Methods
  showBookingForm(): void {
    this.showBookingFormDialog = true;
    this.currentStepIndex = 0;
    this.resetForm();
  }

  closeBookingForm(): void {
    this.showBookingFormDialog = false;
    this.resetForm();
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStepIndex++;
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStepIndex) {
      case 0: // Service Details
        return this.validateServiceDetails();
      case 1: // Choose Cleaner
        return !!this.selectedCleaner;
      case 2: // Payment
        return !!this.selectedCard;
      default:
        return false;
    }
  }

  private validateServiceDetails(): boolean {
    return !!this.locationInput && 
           !!this.selectedServiceType && 
           !!this.selectedDate && 
           !!this.selectedTime;
  }

  // Form Methods
  onLocationInput(): void {
    // You can add address validation or autocomplete logic here
    console.log('Location input:', this.locationInput);
  }

  selectLocation(location: Location): void {
    this.selectedLocation = location;
  }

  addNewLocation(): void {
    console.log('Add new location');
    // Implement add new location logic
  }

  selectCleaner(cleaner: Cleaner): void {
    this.selectedCleaner = cleaner;
  }

  selectCard(card: Card): void {
    this.selectedCard = card;
  }

  addNewCard(): void {
    console.log('Add new card');
    // Implement add new card logic
  }

  processPayment(): void {
    if (this.selectedCard) {
      console.log('Processing payment with card:', this.selectedCard);
      console.log('Booking details:', {
        location: this.locationInput,
        service: this.selectedServiceType,
        date: this.selectedDate,
        time: this.selectedTime,
        cleaner: this.selectedCleaner,
        specialRequests: this.specialRequests
      });
      
      // Simulate payment processing
      setTimeout(() => {
        this.showBookingFormDialog = false;
        this.resetForm();
        // Show success message or navigate to confirmation page
        alert('Booking confirmed successfully!');
      }, 2000);
    }
  }

  private resetForm(): void {
    this.currentStepIndex = 0;
    this.locationInput = '';
    this.selectedServiceType = '';
    this.selectedDate = null;
    this.selectedTime = '';
    this.selectedCleaner = null;
    this.selectedCard = null;
    this.specialRequests = '';
  }
}