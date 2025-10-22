import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface Payout {
  id: string;
  cleaner: string;
  payoutMethod: string;
  amount: number;
  status: string;
}

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    DialogModule
  ],
  templateUrl: './payouts.html',
  styleUrls: ['./payouts.css']  // Changed to CSS
})
export class CleanerPayoutsComponent {
  displayDetailsDialog = false;
  selectedPayout: any;

  payouts: Payout[] = [
    {
      id: 'CP#2508150010',
      cleaner: 'Joseph Tribblani',
      payoutMethod: 'Bank Transfer',
      amount: 299.99,
      status: 'Pending'
    },
    {
      id: 'CP#2508150011',
      cleaner: 'Joseph Tribblani',
      payoutMethod: 'PayPal',
      amount: 299.99,
      status: 'Pending'
    },
    {
      id: 'CP#2508150012',
      cleaner: 'Joseph Tribblani',
      payoutMethod: 'Bank Transfer',
      amount: 299.99,
      status: 'Approved'
    },
    {
      id: 'CP#2508150013',
      cleaner: 'Joseph Tribblani',
      payoutMethod: 'Bank Transfer',
      amount: 299.99,
      status: 'Paid'
    },
    {
      id: 'CP#2508150014',
      cleaner: 'Joseph Tribblani',
      payoutMethod: 'PayPal',
      amount: 299.99,
      status: 'Paid'
    }
  ];

  getStatusSeverity(status: string): Severity {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Approved':
        return 'info';
      case 'Pending':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  showPayoutDetails(payout: Payout) {
    this.selectedPayout = {
      ...payout,
      cleanerName: 'Hogar Nati',
      balanceAmount: 800.00,
      bankDetails: {
        method: 'Bank Transfer',
        company: 'Friends Global Ltd.',
        accountNo: '123123413',
        iban: 'GB44CLRB04097200005667',
        sortCode: '001234124',
        bankName: 'Black Bank',
        bankAddress: '133 Houndsditch, LONDON, EC3A 7BX'
      },
      payoutAmount: 200.00,
      payoutStatus: 'Pending'
    };
    this.displayDetailsDialog = true;
  }
}