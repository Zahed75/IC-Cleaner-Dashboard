import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, Card } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReportService, OverviewReport, FilterOptions, Service, DateRangeOption } from '../../../services/reports/report-service';

interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    SelectButtonModule,
    AutoCompleteModule,
    ButtonModule,
    AutoComplete,
    UIChart,
    Card,
    ToastModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  providers: [MessageService]
})
export class Reports implements OnInit {
  dateRangeOptions: DateRangeOption[] = [];
  serviceTypeOptions: Service[] = [];
  locationOptions: any[] = [];
  datasetOptions = [
    { label: 'By Service Type', value: 'service' },
    { label: 'By Location', value: 'location' }
  ];

  selectedDateRange = 'month';
  selectedServiceType: Service | null = null;
  selectedLocation: string | null = null;
  selectedDataset = 'service';

  filteredServiceTypes: Service[] = [];
  filteredLocations: any[] = [];

  stats = {
    totalBookings: 0,
    bookingChange: 0,
    revenue: 0,
    revenueChange: 0,
    avgRating: 0,
    positiveRating: 0,
    activeCleaners: 0,
    cleanerChange: 0
  };

  additionalMetrics = {
    completion_rate: 0,
    satisfaction_rate: 0,
    repeat_rate: 0,
    avg_response_time: 0
  };

  revenueChart: ChartData = {
    labels: [],
    datasets: []
  };

  serviceDistributionChart: ChartData = {
    labels: [],
    datasets: []
  };

  loading = false;

  constructor(
    private reportService: ReportService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadFilterOptions();
    this.loadReportData();
  }

  loadFilterOptions(): void {
    this.reportService.getFilterOptions().subscribe({
      next: (response) => {
        const filterOptions = response.data;
        
        // Set date range options
        this.dateRangeOptions = filterOptions.date_range_options;
        
        // Set service type options with "All Services" option
        this.serviceTypeOptions = [
          { id: 0, name: 'All Services' },
          ...filterOptions.services
        ];
        
        // Set location options with "All Locations" option
        this.locationOptions = [
          { name: 'All Locations' },
          ...filterOptions.locations.map(loc => ({ name: loc }))
        ];

        // Initialize filtered lists
        this.filteredServiceTypes = this.serviceTypeOptions;
        this.filteredLocations = this.locationOptions;

        // Set default selections
        this.selectedServiceType = this.serviceTypeOptions[0];
        this.selectedLocation = this.locationOptions[0].name;
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load filter options'
        });
      }
    });
  }

  loadReportData(): void {
    this.loading = true;
    
    const params: any = {
      date_range: this.selectedDateRange
    };

    if (this.selectedServiceType && this.selectedServiceType.id !== 0) {
      params.service_type = this.selectedServiceType.id;
    }

    if (this.selectedLocation && this.selectedLocation !== 'All Locations') {
      params.location = this.selectedLocation;
    }

    this.reportService.getOverviewReport(params).subscribe({
      next: (response) => {
        const reportData = response.data;
        this.updateStats(reportData.key_metrics);
        this.updateAdditionalMetrics(reportData.additional_metrics);
        this.updateCharts(reportData.charts);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading report data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load report data'
        });
        this.loading = false;
      }
    });
  }

  updateStats(keyMetrics: any): void {
    this.stats = {
      totalBookings: keyMetrics.total_bookings,
      bookingChange: keyMetrics.booking_change,
      revenue: keyMetrics.revenue,
      revenueChange: keyMetrics.revenue_change,
      avgRating: keyMetrics.avg_rating,
      positiveRating: keyMetrics.positive_rating,
      activeCleaners: keyMetrics.active_cleaners,
      cleanerChange: keyMetrics.cleaner_change
    };
  }

  updateAdditionalMetrics(metrics: any): void {
    this.additionalMetrics = {
      completion_rate: metrics.completion_rate,
      satisfaction_rate: metrics.satisfaction_rate,
      repeat_rate: metrics.repeat_rate,
      avg_response_time: metrics.avg_response_time
    };
  }

  updateCharts(charts: any): void {
    // Revenue Trend Chart
    this.revenueChart = {
      labels: charts.revenue_trend.labels,
      datasets: charts.revenue_trend.datasets.map((dataset: any) => ({
        ...dataset,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }))
    };

    // Service Distribution Chart
    this.serviceDistributionChart = {
      labels: charts.service_distribution.labels,
      datasets: charts.service_distribution.datasets.map((dataset: any) => ({
        ...dataset,
        borderWidth: 0
      }))
    };
  }

  filterServiceTypes(event: any) {
    const query = event.query.toLowerCase();
    this.filteredServiceTypes = this.serviceTypeOptions.filter(option => 
      option.name.toLowerCase().includes(query)
    );
  }

  filterLocations(event: any) {
    const query = event.query.toLowerCase();
    this.filteredLocations = this.locationOptions.filter(option => 
      option.name.toLowerCase().includes(query)
    );
  }

  onFilterChange() {
    this.loadReportData();
  }

  resetFilters() {
    this.selectedDateRange = 'month';
    this.selectedServiceType = this.serviceTypeOptions[0];
    this.selectedLocation = this.locationOptions[0].name;
    this.onFilterChange();
  }

  exportReport() {
    const params: any = {
      date_range: this.selectedDateRange
    };

    if (this.selectedServiceType && this.selectedServiceType.id !== 0) {
      params.service_type = this.selectedServiceType.id;
    }

    if (this.selectedLocation && this.selectedLocation !== 'All Locations') {
      params.location = this.selectedLocation;
    }

    this.reportService.exportReport(params).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report exported successfully'
        });
        
        // Create and download the JSON file
        this.downloadJsonFile(response.data, `report_${new Date().toISOString().split('T')[0]}.json`);
      },
      error: (error) => {
        console.error('Error exporting report:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to export report'
        });
      }
    });
  }

  private downloadJsonFile(data: any, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getRevenueChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#6B7280',
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(107, 114, 128, 0.1)'
          },
          ticks: {
            color: '#6B7280'
          }
        },
        y: {
          grid: {
            color: 'rgba(107, 114, 128, 0.1)'
          },
          ticks: {
            color: '#6B7280',
            callback: (value: any) => {
              if (typeof value === 'number') {
                return '£' + value.toLocaleString();
              }
              return value;
            }
          }
        }
      }
    };
  }

  getServiceDistributionOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6B7280',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  getSelectedDateRangeLabel(): string {
    const option = this.dateRangeOptions.find(opt => opt.value === this.selectedDateRange);
    return option ? option.label : 'Last 30 Days';
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  // Helper method to format currency
  formatCurrency(value: number): string {
    return '£' + value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Helper method to format percentage
  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }
}