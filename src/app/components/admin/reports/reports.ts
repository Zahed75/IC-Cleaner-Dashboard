import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, Card } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
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
    ButtonModule,
      Card,
      UIChart
],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit {
  dateRangeOptions = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'Custom', value: 'custom' }
  ];

  serviceTypeOptions = [
    { label: 'All Services', value: 'all' },
    { label: 'Regular Cleaning', value: 'regular' },
    { label: 'Deep Cleaning', value: 'deep' },
    { label: 'Move Out Cleaning', value: 'moveout' },
    { label: 'Commercial Cleaning', value: 'commercial' }
  ];

  locationOptions = [
    { label: 'All Locations', value: 'all' },
    { label: 'London', value: 'london' },
    { label: 'Manchester', value: 'manchester' },
    { label: 'Birmingham', value: 'birmingham' },
    { label: 'Liverpool', value: 'liverpool' }
  ];

  datasetOptions = [
    { label: 'By Service Type', value: 'service' },
    { label: 'By Location', value: 'location' }
  ];

  selectedDateRange = '30days';
  selectedServiceType = 'all';
  selectedLocation = 'all';
  selectedDataset = 'service';

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

  exportReport() {
    // Export functionality would go here
    console.log('Exporting report...');
  }

  // Add Math.abs function to component
  abs(value: number): number {
    return Math.abs(value);
  }
}