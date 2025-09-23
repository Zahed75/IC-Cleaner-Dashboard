import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, Card } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

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
      Card
],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit {
  dateRangeOptions = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'Last 6 months', value: '6months' },
    { label: 'Last year', value: '1year' },
    { label: 'Custom Range', value: 'custom' }
  ];

  serviceTypeOptions = [
    { name: 'All Services', value: 'all' },
    { name: 'Regular Cleaning', value: 'regular' },
    { name: 'Deep Cleaning', value: 'deep' },
    { name: 'Move Out Cleaning', value: 'moveout' },
    { name: 'Commercial Cleaning', value: 'commercial' }
  ];

  locationOptions = [
    { name: 'All Locations', value: 'all' },
    { name: 'London', value: 'london' },
    { name: 'Manchester', value: 'manchester' },
    { name: 'Birmingham', value: 'birmingham' },
    { name: 'Liverpool', value: 'liverpool' }
  ];

  datasetOptions = [
    { label: 'By Service Type', value: 'service' },
    { label: 'By Location', value: 'location' }
  ];

  selectedDateRange = '30days';
  selectedServiceType: any = { name: 'All Services', value: 'all' };
  selectedLocation: any = { name: 'All Locations', value: 'all' };
  selectedDataset = 'service';

  filteredServiceTypes: any[] = [];
  filteredLocations: any[] = [];

  stats = {
    totalBookings: 786,
    bookingChange: 12,
    revenue: 12489.02,
    revenueChange: 8,
    avgRating: 4.7,
    positiveRating: 92,
    activeCleaners: 21,
    cleanerChange: -2
  };

  revenueChart: ChartData = {
    labels: [],
    datasets: []
  };

  serviceDistributionChart: ChartData = {
    labels: [],
    datasets: []
  };

  ngOnInit() {
    this.initializeCharts();
    // Initialize filtered lists
    this.filteredServiceTypes = this.serviceTypeOptions;
    this.filteredLocations = this.locationOptions;
  }

  initializeCharts() {
    // Revenue Overview Chart
    this.revenueChart = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 19000, 15000, 18000, 22000, 19000, 25000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Bookings',
          data: [650, 720, 680, 750, 820, 780, 860],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };

    // Service Distribution Chart
    this.serviceDistributionChart = {
      labels: ['Regular Cleaning', 'Deep Cleaning', 'Move Out', 'Commercial', 'Special'],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6'
          ],
          borderWidth: 0
        }
      ]
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
            callback: function(value: any) {
              return '£' + value.toLocaleString();
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
        }
      }
    };
  }

  onFilterChange() {
    // Simulate data change based on filters
    console.log('Filters changed:', {
      dateRange: this.selectedDateRange,
      serviceType: this.selectedServiceType,
      location: this.selectedLocation
    });
  }

  resetFilters() {
    this.selectedDateRange = '30days';
    this.selectedServiceType = { name: 'All Services', value: 'all' };
    this.selectedLocation = { name: 'All Locations', value: 'all' };
    this.onFilterChange();
  }

  exportReport() {
    // Export functionality would go here
    console.log('Exporting report...');
  }

  getSelectedDateRangeLabel(): string {
    const labels: { [key: string]: string } = {
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days', 
      '90days': 'Last 90 Days',
      '6months': 'Last 6 Months',
      '1year': 'Last Year',
      'custom': 'Custom Date Range'
    };
    return labels[this.selectedDateRange] || 'Last 30 Days';
  }

  abs(value: number): number {
    return Math.abs(value);
  }
}