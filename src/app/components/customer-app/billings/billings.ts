import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BillingRecord {
  bookingId: string;
  service: string;
  dateTime: string;
  amount: string;
  status: string;
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
}

@Component({
  selector: 'customer-app-billings',
  imports: [CommonModule, FormsModule],
  templateUrl: './billings.html',
  styleUrl: './billings.css'
})
export class CustomerBillingComponent {
  showAddCardForm = false;
  selectedBill: BillingRecord | null = null;
  isEditing = false;
  editingCardId: number | null = null;

  savedCards: Card[] = [
    {
      id: 1,
      cardNumber: '4242',
      lastFour: '4242',
      cardType: 'VISA',
      expiryMonth: '05',
      expiryYear: '2028',
      expiryDate: '05/2028',
      cvc: '',
      cardholderName: '',
      country: '',
      postcode: ''
    },
    {
      id: 2,
      cardNumber: '1234',
      lastFour: '1234',
      cardType: 'VISA',
      expiryMonth: '05',
      expiryYear: '2030',
      expiryDate: '05/2030',
      cvc: '',
      cardholderName: '',
      country: '',
      postcode: ''
    }
  ];

  newCard: Card = {
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: '',
    postcode: ''
  };

  billingHistory: BillingRecord[] = [
    {
      bookingId: '[C#2508150010]',
      service: 'Office / HMO',
      dateTime: '15 Aug 2025, 10:00 AM',
      amount: '$299.99',
      status: 'Payment Due'
    },
    {
      bookingId: '[C#2508150010]',
      service: 'End-of-Tenancy',
      dateTime: '10 Jul 2025, 03:00 PM',
      amount: '$399.99',
      status: 'Paid'
    },
    {
      bookingId: '[C#2508150010]',
      service: 'Regular Cleaning',
      dateTime: '31 May 2025, 10:00 AM',
      amount: '$199.99',
      status: 'Canceled'
    }
  ];

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
      // Update existing card
      const cardIndex = this.savedCards.findIndex(card => card.id === this.editingCardId);
      if (cardIndex !== -1) {
        const lastFour = this.newCard.cardNumber.slice(-4);
        this.savedCards[cardIndex] = {
          ...this.savedCards[cardIndex],
          cardNumber: this.newCard.cardNumber,
          lastFour: lastFour,
          expiryDate: this.newCard.expiryDate,
          cardholderName: this.newCard.cardholderName,
          country: this.newCard.country,
          postcode: this.newCard.postcode
        };
      }
      alert('Card updated successfully!');
    } else {
      // Add new card
      const lastFour = this.newCard.cardNumber.slice(-4);
      const newCard: Card = {
        id: this.savedCards.length + 1,
        cardNumber: this.newCard.cardNumber,
        lastFour: lastFour,
        cardType: 'VISA', // You can detect card type based on number
        expiryDate: this.newCard.expiryDate,
        cvc: this.newCard.cvc,
        cardholderName: this.newCard.cardholderName,
        country: this.newCard.country,
        postcode: this.newCard.postcode
      };
      this.savedCards.push(newCard);
      alert('Card saved successfully!');
    }
    
    this.showAddCardForm = false;
    this.isEditing = false;
    this.editingCardId = null;
    this.resetCardForm();
  }

  editCard(cardId: number): void {
    const card = this.savedCards.find(c => c.id === cardId);
    if (card) {
      this.newCard = {
        cardNumber: card.cardNumber,
        expiryDate: card.expiryDate,
        cvc: card.cvc || '',
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
      this.savedCards = this.savedCards.filter(card => card.id !== cardId);
      alert('Card removed successfully!');
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

  downloadInvoice(bill: BillingRecord): void {
    console.log('Downloading invoice for:', bill.bookingId);
    alert(`Downloading invoice for ${bill.bookingId}`);
  }
}