import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule, Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule, Tag } from 'primeng/tag';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

interface Payout {
  id: string;
  cleaner: string;
  payoutMethod: string;
  amount: number;
  status: string;
  currency: string;
  balanceAmount: number;
  requestDate: string;
  approvedDate?: string;
  paidDate?: string;
}

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    FormsModule,
      Card,
      Tag,
      Dialog
],
  templateUrl: './payouts.html',
  styleUrls: ['./payouts.css']
})
export class Payouts {
  payouts: Payout[] = [
    { 
      id: 'CPP2508150010', 
      cleaner: 'Joseph Tribblani', 
      payoutMethod: 'Bank Transfer', 
      amount: 299.99, 
      status: 'Pending', 
      currency: '$',
      balanceAmount: 800.00,
      requestDate: '2024-01-15'
    },
    { 
      id: 'CPP2508150011', 
      cleaner: 'Joseph Tribblani', 
      payoutMethod: 'PayPal', 
      amount: 299.99, 
      status: 'Pending', 
      currency: '$',
      balanceAmount: 800.00,
      requestDate: '2024-01-16'
    },
    { 
      id: 'CPP2508150012', 
      cleaner: 'Joseph Tribblani', 
      payoutMethod: 'Bank Transfer', 
      amount: 299.99, 
      status: 'Approved', 
      currency: '$',
      balanceAmount: 800.00,
      requestDate: '2024-01-14',
      approvedDate: '2024-01-15'
    },
    { 
      id: 'CPP2508150013', 
      cleaner: 'Joseph Tribblani', 
      payoutMethod: 'Bank Transfer', 
      amount: 299.99, 
      status: 'Paid', 
      currency: '$',
      balanceAmount: 800.00,
      requestDate: '2024-01-10',
      approvedDate: '2024-01-11',
      paidDate: '2024-01-12'
    },
    { 
      id: 'CPP2508150014', 
      cleaner: 'Hogar Nati', 
      payoutMethod: 'Bank Transfer', 
      amount: 200.00, 
      status: 'Pending', 
      currency: '£',
      balanceAmount: 800.00,
      requestDate: '2024-01-17'
    }
  ];

  stats = {
    totalDisputes: 79,
    pending: 1,
    resolved: 78,
    highPriority: 1
  };

  searchText: string = '';
  payoutDialog: boolean = false;
  selectedPayout: Payout | null = null;

  get filteredPayouts(): Payout[] {
    if (!this.searchText) return this.payouts;
    
    return this.payouts.filter(payout => 
      payout.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
      payout.cleaner.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Paid': return 'info';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  }

  showPayoutDetails(payout: Payout): void {
    this.selectedPayout = { ...payout };
    this.payoutDialog = true;
  }

  approvePayout(): void {
    if (this.selectedPayout) {
      const payoutIndex = this.payouts.findIndex(p => p.id === this.selectedPayout!.id);
      if (payoutIndex !== -1) {
        this.payouts[payoutIndex].status = 'Approved';
        this.payouts[payoutIndex].approvedDate = new Date().toISOString().split('T')[0];
      }
      this.payoutDialog = false;
    }
  }

  rejectPayout(): void {
    if (this.selectedPayout) {
      const payoutIndex = this.payouts.findIndex(p => p.id === this.selectedPayout!.id);
      if (payoutIndex !== -1) {
        this.payouts[payoutIndex].status = 'Rejected';
      }
      this.payoutDialog = false;
    }
  }

  markAsPaid(): void {
    if (this.selectedPayout) {
      const payoutIndex = this.payouts.findIndex(p => p.id === this.selectedPayout!.id);
      if (payoutIndex !== -1) {
        this.payouts[payoutIndex].status = 'Paid';
        this.payouts[payoutIndex].paidDate = new Date().toISOString().split('T')[0];
      }
      this.payoutDialog = false;
    }
  }

  getBankDetails() {
    return {
      accountName: 'Friends Global Ltd.',
      accountNo: '123123413',
      iban: 'GB44CLRB04097200005667',
      sortCode: '001234124',
      bankName: 'Black Bank',
      bankAddress: '133 Houndsditch, LONDON, EC3A 7BX'
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getPayoutHistory(payout: Payout): any[] {
    const history = [
      { action: 'Requested', date: payout.requestDate, status: 'Pending' }
    ];

    if (payout.approvedDate) {
      history.push({ action: 'Approved', date: payout.approvedDate, status: 'Approved' });
    }

    if (payout.paidDate) {
      history.push({ action: 'Paid', date: payout.paidDate, status: 'Paid' });
    }

    return history;
  }
}