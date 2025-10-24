import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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

// Services
import { BookingService, Cleaner, Service, Booking, BookingRequest, ApiResponse } from '../../../services/customer-service/bookings/booking-service';

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
    HttpClientModule,
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
export class CustomerBookingsComponent implements OnInit {
  // Bookings Data - Now using API data
  bookings: any[] = [];
  availableCleaners: any[] = [];
  services: Service[] = [];
  
  // Loading states
  isLoading = false;
  isCreatingBooking = false;

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
  selectedBooking: any = null;
  selectedServiceType: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedCleaner: any = null;
  selectedCard: Card | null = null;

  // Form Data
  locationInput: string = '';
  specialRequests: string = '';
  minDate: string = new Date().toISOString().split('T')[0];

  // Dropdown Options
  serviceTypes: any[] = [];

  availableTimes: any[] = [
    { label: '08:00 AM', value: '08:00:00' },
    { label: '09:00 AM', value: '09:00:00' },
    { label: '10:00 AM', value: '10:00:00' },
    { label: '11:00 AM', value: '11:00:00' },
    { label: '12:00 PM', value: '12:00:00' },
    { label: '01:00 PM', value: '13:00:00' },
    { label: '02:00 PM', value: '14:00:00' },
    { label: '03:00 PM', value: '15:00:00' },
    { label: '04:00 PM', value: '16:00:00' },
    { label: '05:00 PM', value: '17:00:00' }
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

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadCleaners();
    this.loadServices();
  }

  // API Methods
  private loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (response: ApiResponse<Booking[]>) => {
        this.bookings = response.data.map((booking: Booking) => ({
          id: `IC#${booking.id}`,
          cleaner: this.getCleanerName(booking),
          service: booking.service_detail.name,
          dateTime: this.getDisplayDateTime(booking),
          amount: this.getAmount(booking),
          status: booking.status,
          originalData: booking
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading bookings:', error);
        alert('Failed to load bookings');
        this.isLoading = false;
      }
    });
  }

  private loadCleaners(): void {
    this.bookingService.getAllCleaners().subscribe({
      next: (response: ApiResponse<Cleaner[]>) => {
        this.availableCleaners = response.data
          .filter((cleaner: Cleaner) => cleaner.profile.status === 'approved' && cleaner.is_active)
          .map((cleaner: Cleaner) => ({
            id: cleaner.id,
            name: `${cleaner.first_name} ${cleaner.last_name}`,
            completedJobs: cleaner.profile.total_services_done,
            rating: parseFloat(cleaner.profile.rating),
            originalData: cleaner
          }));
      },
      error: (error: any) => {
        console.error('Error loading cleaners:', error);
        alert('Failed to load cleaners');
      }
    });
  }

  private loadServices(): void {
    this.bookingService.getAllServices().subscribe({
      next: (response: ApiResponse<Service[]>) => {
        this.services = response.data.filter((service: Service) => service.is_active);
        // Update serviceTypes dropdown with real data
        this.serviceTypes = this.services.map(service => ({
          label: `${service.name} - £${service.price_per_hour}/hour`,
          value: service.id.toString()
        }));
      },
      error: (error: any) => {
        console.error('Error loading services:', error);
        alert('Failed to load services');
      }
    });
  }

  // Helper methods to format data for display
  private getCleanerName(booking: Booking): string {
    if (booking.cleaner_detail) {
      return `${booking.cleaner_detail.first_name} ${booking.cleaner_detail.last_name}`;
    }
    return 'Not Assigned';
  }

  private getDisplayDateTime(booking: Booking): string {
    const date = new Date(booking.booking_date);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    const time = booking.time_slot.slice(0, 5);
    return `${formattedDate}, ${time}`;
  }

  private getAmount(booking: Booking): string {
    const price = parseFloat(booking.service_detail.price_per_hour);
    return `£${price.toFixed(2)}`;
  }

  // Booking Details Methods
  showBookingDetails(booking: any): void {
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

  editBooking(booking: any): void {
    console.log('Edit booking:', booking);
    this.showBookingDialog = false;
    this.showBookingForm();
  }

  cancelBooking(booking: any): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const originalBooking = booking.originalData;
      const updateData: BookingRequest = {
        location: originalBooking.location,
        booking_date: originalBooking.booking_date,
        time_slot: originalBooking.time_slot,
        service: originalBooking.service,
        assign_cleaner: originalBooking.assign_cleaner,
        special_requirements: originalBooking.special_requirements
      };
      
      this.bookingService.updateBooking(originalBooking.id, updateData).subscribe({
        next: (response: ApiResponse<Booking>) => {
          alert('Booking cancelled successfully');
          this.loadBookings();
          this.showBookingDialog = false;
        },
        error: (error: any) => {
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking');
        }
      });
    }
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
      case 0:
        return this.validateServiceDetails();
      case 1:
        return !!this.selectedCleaner;
      case 2:
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
    console.log('Location input:', this.locationInput);
  }

  selectCleaner(cleaner: any): void {
    this.selectedCleaner = cleaner;
  }

  selectCard(card: Card): void {
    this.selectedCard = card;
  }

  addNewCard(): void {
    console.log('Add new card');
  }

  processPayment(): void {
    if (this.selectedCard && this.validateServiceDetails() && this.selectedCleaner) {
      this.isCreatingBooking = true;
      
      const bookingData: BookingRequest = {
        location: this.locationInput,
        booking_date: this.selectedDate,
        time_slot: this.selectedTime,
        service: parseInt(this.selectedServiceType),
        assign_cleaner: this.selectedCleaner.id,
        special_requirements: this.specialRequests
      };

      console.log('Creating booking with data:', bookingData);

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response: ApiResponse<Booking>) => {
          alert('Booking created successfully!');
          this.showBookingFormDialog = false;
          this.resetForm();
          this.loadBookings();
          this.isCreatingBooking = false;
        },
        error: (error: any) => {
          console.error('Error creating booking:', error);
          alert('Failed to create booking');
          this.isCreatingBooking = false;
        }
      });
    }
  }

  private resetForm(): void {
    this.currentStepIndex = 0;
    this.locationInput = '';
    this.selectedServiceType = '';
    this.selectedDate = '';
    this.selectedTime = '';
    this.selectedCleaner = null;
    this.selectedCard = null;
    this.specialRequests = '';
  }
}