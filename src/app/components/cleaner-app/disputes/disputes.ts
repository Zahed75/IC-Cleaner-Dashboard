import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface Dispute {
  id: string;
  cleaner: string;
  customer: string;
  serviceDate: string;
  amount: number;
  status: string;
  priority: string;
  createdAt: string;
}

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    DialogModule
  ],
  templateUrl: './disputes.html',
  styleUrls: ['./disputes.css']
})
export class CleanerDisputesComponent {
  displayDetailsDialog = false;
  selectedDispute: any;

  disputes: Dispute[] = [
    {
      id: 'DSP#250815001',
      cleaner: 'Maria Garcia',
      customer: 'John Smith',
      serviceDate: '2024-01-15',
      amount: 150.00,
      status: 'Pending',
      priority: 'High',
      createdAt: '2024-01-16'
    },
    {
      id: 'DSP#250815002',
      cleaner: 'James Wilson',
      customer: 'Sarah Johnson',
      serviceDate: '2024-01-14',
      amount: 200.00,
      status: 'In Review',
      priority: 'Medium',
      createdAt: '2024-01-15'
    },
    {
      id: 'DSP#250815003',
      cleaner: 'Lisa Brown',
      customer: 'Mike Davis',
      serviceDate: '2024-01-13',
      amount: 180.00,
      status: 'Resolved',
      priority: 'Low',
      createdAt: '2024-01-14'
    },
    {
      id: 'DSP#250815004',
      cleaner: 'Robert Taylor',
      customer: 'Emily Clark',
      serviceDate: '2024-01-12',
      amount: 220.00,
      status: 'Pending',
      priority: 'High',
      createdAt: '2024-01-13'
    },
    {
      id: 'DSP#250815005',
      cleaner: 'Jennifer Lee',
      customer: 'David Wilson',
      serviceDate: '2024-01-11',
      amount: 190.00,
      status: 'Resolved',
      priority: 'Medium',
      createdAt: '2024-01-12'
    }
  ];

  getStatusSeverity(status: string): Severity {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'In Review':
        return 'info';
      case 'Pending':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): Severity {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warn';
      case 'Low':
        return 'info';
      default:
        return 'secondary';
    }
  }

  showDisputeDetails(dispute: Dispute) {
    this.selectedDispute = {
      ...dispute,
      disputeDetails: {
        description: 'Customer reported that the cleaning was not completed to their satisfaction. Specific concerns include dusty surfaces and uncleaned windows.',
        evidence: ['photo_evidence_1.jpg', 'customer_feedback.pdf'],
        resolution: dispute.status === 'Resolved' ? 'Partial refund issued after review. Cleaner will return for touch-up cleaning.' : 'Under investigation',
        assignedTo: 'Sarah Miller (Support Team)',
        lastUpdated: '2024-01-22 14:30'
      }
    };
    this.displayDetailsDialog = true;
  }
}