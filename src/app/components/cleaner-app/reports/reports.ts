import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { ReportsService, ReportData, ReportFiltersUI, ApiResponse } from '../../../services/cleaner-service/reports/reports-service';

interface DropdownOption {
  label: string;
  value: string;
}

interface ServiceOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectModule,
    ChartModule,
    ToastModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  providers: [MessageService]
})
export class CleanerReportsComponent implements OnInit {
  dateRangeOptions: DropdownOption[] = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This year', value: '1y' }
  ];

  serviceTypeOptions: ServiceOption[] = [
    { label: 'All services', value: 0 },
    { label: 'Window Cleaning', value: 1 },
    { label: 'Room Cleaning', value: 2 },
    { label: 'Deep Cleaning', value: 3 }
  ];

  locationOptions: DropdownOption[] = [
    { label: 'All locations', value: 'all' },
    { label: 'London', value: 'London' },
    { label: 'Manchester', value: 'Manchester' },
    { label: 'Birmingham', value: 'Birmingham' }
  ];

  selectedDateRange: DropdownOption = this.dateRangeOptions[1]; // 30 days
  selectedServiceType: ServiceOption = this.serviceTypeOptions[0]; // All services
  selectedLocation: DropdownOption = this.locationOptions[0]; // All locations

  // Report data
  reportData: ReportData | null = null;
  loading = false;

  // Revenue Chart Data
  revenueData: any;
  revenueOptions: any;

  // Service Distribution Chart Data
  serviceData: any;
  serviceOptions: any;

  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    
    const filters: ReportFiltersUI = {
      range: this.selectedDateRange.value,
      service_id: this.selectedServiceType.value === 0 ? undefined : this.selectedServiceType.value,
      location: this.selectedLocation.value === 'all' ? undefined : this.selectedLocation.value
    };

    this.reportsService.getReports(filters).subscribe({
      next: (response: ApiResponse<ReportData>) => {
        if (response.code === 200 && response.data) {
          this.reportData = response.data;
          this.initializeCharts();
        } else {
          this.showError('Failed to load reports: ' + response.message);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading reports:', error);
        this.showError('Failed to load reports. Please try again.');
        this.loading = false;
        // Initialize with empty data
        this.initializeEmptyCharts();
      }
    });
  }

  onFilterChange() {
    this.loadReports();
  }

  initializeCharts() {
    if (!this.reportData) return;

    // Revenue Overview Chart
    const revenueChart = this.reportData.charts.revenue_overview;
    this.revenueData = {
      labels: revenueChart.labels,
      datasets: revenueChart.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        fill: false,
        borderColor: index === 0 ? '#3498db' : '#2ecc71',
        tension: 0.4,
        backgroundColor: index === 0 ? 'rgba(52, 152, 219, 0.1)' : 'rgba(46, 204, 113, 0.1)'
      }))
    };

    this.revenueOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#2c3e50',
            font: {
              weight: '600'
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: '#5a6c7d'
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: '#5a6c7d',
            callback: function(value: any) {
              return '£' + value.toLocaleString();
            }
          }
        }
      }
    };

    // Service Distribution Chart
    this.serviceData = {
      labels: revenueChart.labels,
      datasets: [
        {
          label: 'Bookings',
          backgroundColor: '#3498db',
          data: revenueChart.series.find(s => s.name === 'Bookings')?.data || Array(revenueChart.labels.length).fill(0)
        },
        {
          label: 'Revenue',
          backgroundColor: '#2ecc71',
          data: revenueChart.series.find(s => s.name === 'Revenue')?.data || Array(revenueChart.labels.length).fill(0)
        }
      ]
    };

    this.serviceOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#2c3e50',
            font: {
              weight: '600'
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: '#5a6c7d'
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: '#5a6c7d'
          }
        }
      }
    };
  }

  initializeEmptyCharts() {
    // Empty revenue chart
    this.revenueData = {
      labels: ['No Data'],
      datasets: [
        {
          label: 'Revenue',
          data: [0],
          fill: false,
          borderColor: '#3498db',
          tension: 0.4,
          backgroundColor: 'rgba(52, 152, 219, 0.1)'
        },
        {
          label: 'Bookings',
          data: [0],
          fill: false,
          borderColor: '#2ecc71',
          tension: 0.4,
          backgroundColor: 'rgba(46, 204, 113, 0.1)'
        }
      ]
    };

    this.revenueOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

    // Empty service distribution chart
    this.serviceData = {
      labels: ['No Data'],
      datasets: [
        {
          label: 'No Data',
          backgroundColor: '#95a5a6',
          data: [0]
        }
      ]
    };

    this.serviceOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };
  }

  // Helper methods for stats cards
  getTotalBookings(): number {
    return this.reportData?.kpis.total_bookings.value || 0;
  }

  getBookingsDelta(): string {
    const delta = this.reportData?.kpis.total_bookings.delta || 0;
    return delta > 0 ? `+${delta} from last period` : `${delta} from last period`;
  }

  getBookingsTrend(): string {
    const delta = this.reportData?.kpis.total_bookings.delta || 0;
    return delta >= 0 ? 'positive' : 'negative';
  }

  getRevenue(): string {
    const revenue = this.reportData?.kpis.revenue.value || 0;
    return `£${revenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getRevenueDelta(): string {
    const deltaPct = this.reportData?.kpis.revenue.delta_pct || 0;
    return deltaPct > 0 ? `${deltaPct}% from last period` : `${Math.abs(deltaPct)}% from last period`;
  }

  getRevenueTrend(): string {
    const deltaPct = this.reportData?.kpis.revenue.delta_pct || 0;
    return deltaPct >= 0 ? 'positive' : 'negative';
  }

  getAverageRating(): string {
    const rating = this.reportData?.kpis.avg_rating.value || 0;
    return rating.toFixed(1);
  }

  // NEW METHOD: Get numeric rating for comparison in template
  getNumericRating(): number {
    const rating = this.reportData?.kpis.avg_rating.value || 0;
    return rating;
  }

  getPositiveRate(): string {
    const positivePct = this.reportData?.kpis.avg_rating.positive_pct || 0;
    return `${positivePct}% Positive`;
  }

  getActiveDisputes(): number {
    return this.reportData?.kpis.active_disputes.value || 0;
  }

  getDisputesDelta(): string {
    const delta = this.reportData?.kpis.active_disputes.delta || 0;
    return delta > 0 ? `+${delta} from last period` : `${delta} from last period`;
  }

  getDisputesTrend(): string {
    const delta = this.reportData?.kpis.active_disputes.delta || 0;
    return delta <= 0 ? 'positive' : 'negative';
  }

  // Generate stars for rating
  getStars(rating: number): { full: number, half: boolean, empty: number } {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      full: fullStars,
      half: hasHalfStar,
      empty: emptyStars
    };
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
}