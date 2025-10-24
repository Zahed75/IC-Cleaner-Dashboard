import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BillingService, PaymentMethod, Booking, ApiResponse } from '../../../services/customer-service/billing/billing-service';

interface BillingRecord {
  bookingId: string;
  service: string;
  dateTime: string;
  amount: string;
  status: string;
  bookingData?: Booking;
}

interface Card {
  id?: number;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  postcode: string;
  lastFour?: string;
  cardType?: string;
  expiryMonth?: string;
  expiryYear?: string;
  is_default?: boolean;
}

@Component({
  selector: 'customer-app-billings',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './billings.html',
  styleUrl: './billings.css'
})
export class CustomerBillingComponent implements OnInit {
  showAddCardForm = false;
  selectedBill: BillingRecord | null = null;
  isEditing = false;
  editingCardId: number | null = null;
  isLoading = false;
  errorMessage = '';

  savedCards: Card[] = [];
  billingHistory: BillingRecord[] = [];

  newCard: Card = {
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: '',
    postcode: ''
  };

  constructor(private billingService: BillingService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
    this.loadBookings();
  }

  loadPaymentMethods(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.billingService.getPaymentMethods().subscribe({
      next: (response: ApiResponse<PaymentMethod[]>) => {
        console.log('Payment methods response:', response);
        if (response.code === 200 && response.data) {
          this.savedCards = response.data.map(paymentMethod => ({
            id: paymentMethod.id,
            cardNumber: `**** **** **** ${paymentMethod.last4}`,
            lastFour: paymentMethod.last4,
            cardType: this.formatCardBrand(paymentMethod.brand),
            expiryMonth: paymentMethod.exp_month.toString().padStart(2, '0'),
            expiryYear: paymentMethod.exp_year.toString(),
            expiryDate: `${paymentMethod.exp_month.toString().padStart(2, '0')}/${paymentMethod.exp_year}`,
            cvc: '***',
            cardholderName: 'Cardholder Name',
            country: 'United Kingdom',
            postcode: 'XXXXX',
            is_default: paymentMethod.is_default
          }));
          console.log('Processed cards:', this.savedCards);
        } else {
          this.errorMessage = response.message || 'Failed to load payment methods';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.errorMessage = 'Error loading payment methods. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadBookings(): void {
    this.billingService.getBookings().subscribe({
      next: (response: ApiResponse<Booking[]>) => {
        console.log('Bookings response:', response);
        if (response.code === 200 && response.data) {
          this.billingHistory = response.data.map(booking => {
            const pricePerHour = parseFloat(booking.service_detail.price_per_hour);
            const platformFee = parseFloat(booking.service_detail.platform_fee_per_hour);
            const totalAmount = pricePerHour + platformFee;
            
            return {
              bookingId: `[C#${booking.id.toString().padStart(10, '0')}]`,
              service: booking.service_detail.name,
              dateTime: this.formatDateTime(booking.booking_date, booking.time_slot),
              amount: `$${totalAmount.toFixed(2)}`,
              status: this.mapBookingStatus(booking.status),
              bookingData: booking
            };
          });
        }
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  private formatCardBrand(brand: string): string {
    const brandMap: { [key: string]: string } = {
      'visa': 'VISA',
      'mastercard': 'MasterCard',
      'amex': 'American Express',
      'discover': 'Discover',
      'diners': 'Diners Club'
    };
    return brandMap[brand.toLowerCase()] || brand.toUpperCase();
  }

  private formatDateTime(date: string, time: string): string {
    try {
      const bookingDate = new Date(date);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      };
      const formattedDate = bookingDate.toLocaleDateString('en-GB', options);
      
      const timeParts = time.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      
      return `${formattedDate}, ${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      return `${date}, ${time}`;
    }
  }

  private mapBookingStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'Paid',
      'pending': 'Payment Due',
      'cancelled': 'Canceled',
      'confirmed': 'Paid',
      'paid': 'Paid'
    };
    return statusMap[status.toLowerCase()] || status;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    
    const groups = value.match(/.{1,4}/g);
    this.newCard.cardNumber = groups ? groups.join(' ') : value;
  }

  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    
    if (value.length > 2) {
      this.newCard.expiryDate = value.substring(0, 2) + ' / ' + value.substring(2);
    } else {
      this.newCard.expiryDate = value;
    }
  }

  saveCard(): void {
    if (this.isEditing && this.editingCardId) {
      this.updateCard();
    } else {
      this.createCard();
    }
  }

  private createCard(): void {
    const cardNumber = this.newCard.cardNumber.replace(/\s/g, '');
    
    if (cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
    }

    const expiryParts = this.newCard.expiryDate.split('/').map(part => part.trim());
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
        alert('Please enter a valid expiry date in MM/YY format');
        return;
    }

    const expMonth = parseInt(expiryParts[0]);
    const expYear = parseInt('20' + expiryParts[1]);

    const paymentMethod: PaymentMethod = {
        stripe_customer_id: `cus_test_${Date.now()}`, // This will be generated if not provided
        stripe_payment_method_id: `pm_test_${Date.now()}`,
        brand: this.detectCardType(cardNumber),
        last4: cardNumber.slice(-4),
        exp_month: expMonth,
        exp_year: expYear,
        is_default: this.savedCards.length === 0
    };

    console.log('Creating payment method:', paymentMethod);

    this.billingService.createPaymentMethod(paymentMethod).subscribe({
        next: (response) => {
            console.log('Card created successfully:', response);
            alert('Card saved successfully!');
            this.showAddCardForm = false;
            this.resetCardForm();
            this.loadPaymentMethods();
        },
        error: (error) => {
            console.error('Error creating card:', error);
            alert('Error saving card. Please try again.');
        }
    });
}

  private updateCard(): void {
    if (!this.editingCardId) return;

    const cardNumber = this.newCard.cardNumber.replace(/\s/g, '');
    const expiryParts = this.newCard.expiryDate.split('/').map(part => part.trim());
    const expMonth = parseInt(expiryParts[0]);
    const expYear = parseInt('20' + expiryParts[1]);

    const paymentMethod: PaymentMethod = {
      stripe_customer_id: 'cus_test_1234',
      stripe_payment_method_id: 'pm_test_' + Date.now(),
      brand: this.detectCardType(cardNumber),
      last4: cardNumber.slice(-4),
      exp_month: expMonth,
      exp_year: expYear,
      is_default: true
    };

    this.billingService.updatePaymentMethod(this.editingCardId, paymentMethod).subscribe({
      next: (response: ApiResponse<PaymentMethod>) => {
        if (response.code === 200) {
          alert('Card updated successfully!');
          this.showAddCardForm = false;
          this.resetCardForm();
          this.loadPaymentMethods();
        }
      },
      error: (error) => {
        console.error('Error updating card:', error);
        alert('Error updating card. Please try again.');
      }
    });
  }

  setDefaultCard(cardId: number): void {
    this.billingService.setDefaultPaymentMethod(cardId).subscribe({
      next: (response) => {
        alert('Default payment method updated.');
        this.loadPaymentMethods();
      },
      error: (error) => {
        console.error('Error setting default card:', error);
        alert('Error setting default card. Please try again.');
      }
    });
  }

  editCard(cardId: number): void {
    const card = this.savedCards.find(c => c.id === cardId);
    if (card) {
      this.newCard = {
        cardNumber: card.cardNumber,
        expiryDate: card.expiryDate,
        cvc: '123', // Placeholder
        cardholderName: card.cardholderName,
        country: card.country,
        postcode: card.postcode
      };
      this.isEditing = true;
      this.editingCardId = cardId;
      this.showAddCardForm = true;
    }
  }

  removeCard(cardId: number): void {
    if (confirm('Are you sure you want to remove this card?')) {
      this.billingService.deletePaymentMethod(cardId).subscribe({
        next: (response) => {
          alert('Card removed successfully!');
          this.loadPaymentMethods();
        },
        error: (error) => {
          console.error('Error removing card:', error);
          alert('Error removing card. Please try again.');
        }
      });
    }
  }

  resetCardForm(): void {
    this.newCard = {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardholderName: '',
      country: '',
      postcode: ''
    };
    this.isEditing = false;
    this.editingCardId = null;
  }

  showBillingDetails(bill: BillingRecord): void {
    this.selectedBill = bill;
  }

  // downloadInvoice(bill: BillingRecord): void {
  //   console.log('Downloading invoice for:', bill.bookingId);
  //   alert(`Downloading invoice for ${bill.bookingId}`);
  // }

  private detectCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    
    return 'visa';
  }
}