import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectModule,
    ChartModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class CleanerReportsComponent {
  dateRangeOptions: DropdownOption[] = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'This year', value: 'year' }
  ];

  serviceTypeOptions: DropdownOption[] = [
    { label: 'All services', value: 'all' },
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Deep Cleaning', value: 'deep' }
  ];

  locationOptions: DropdownOption[] = [
    { label: 'All locations', value: 'all' },
    { label: 'London', value: 'london' },
    { label: 'Manchester', value: 'manchester' },
    { label: 'Birmingham', value: 'birmingham' }
  ];

  selectedDateRange: DropdownOption = this.dateRangeOptions[1];
  selectedServiceType: DropdownOption = this.serviceTypeOptions[0];
  selectedLocation: DropdownOption = this.locationOptions[0];

  // Revenue Chart Data
  revenueData: any;
  revenueOptions: any;

  // Service Distribution Chart Data
  serviceData: any;
  serviceOptions: any;

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    // Revenue Overview Chart
    this.revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'First Dataset',
          data: [12000, 15000, 11000, 13000, 16000, 14000, 12489],
          fill: false,
          borderColor: '#3498db',
          tension: 0.4,
          backgroundColor: 'rgba(52, 152, 219, 0.1)'
        },
        {
          label: 'Record Dataset',
          data: [10000, 12000, 9000, 11000, 14000, 12000, 11000],
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
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Residential',
          backgroundColor: '#3498db',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Commercial',
          backgroundColor: '#2ecc71',
          data: [28, 48, 40, 19, 86, 27, 90]
        },
        {
          label: 'Deep Cleaning',
          backgroundColor: '#e74c3c',
          data: [45, 25, 60, 35, 70, 45, 60]
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
}