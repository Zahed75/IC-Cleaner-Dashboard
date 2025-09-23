import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG standalone components
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { MessageService } from 'primeng/api';

interface Service {
  id: string;
  name: string;
  cost: number;
  pricePerHour: number;
  platformFee: number;
  platformFeePercentage: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    Card,
    TableModule,
    Tag,
    Dialog,
    Toast,
    InputText,
    InputNumber,
    ToggleSwitch
  ],
  providers: [MessageService],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  serviceForm: FormGroup;
  showServiceForm = false;
  isEditMode = false;
  editingService: Service | null = null;

  services: Service[] = [
    {
      id: 'ICCSVM001',
      name: 'Regular Cleaning',
      cost: 299.99,
      pricePerHour: 17.50,
      platformFee: 4.00,
      platformFeePercentage: 22.86,
      status: 'Active'
    },
    {
      id: 'ICCSVM002',
      name: 'Deep Cleaning',
      cost: 349.99,
      pricePerHour: 20.00,
      platformFee: 4.50,
      platformFeePercentage: 22.50,
      status: 'Active'
    },
    {
      id: 'ICCSVM003',
      name: 'Seasonal Cleaning',
      cost: 399.99,
      pricePerHour: 22.50,
      platformFee: 5.00,
      platformFeePercentage: 22.22,
      status: 'Active'
    },
    {
      id: 'ICCSVM004',
      name: 'Post-Event Cleaning',
      cost: 449.99,
      pricePerHour: 25.00,
      platformFee: 5.50,
      platformFeePercentage: 22.00,
      status: 'Inactive'
    },
    {
      id: 'ICCSVM005',
      name: 'Move-In/Move-Out Cleaning',
      cost: 499.99,
      pricePerHour: 28.00,
      platformFee: 6.00,
      platformFeePercentage: 21.43,
      status: 'Inactive'
    }
  ];

  constructor() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      pricePerHour: [0, [Validators.required, Validators.min(0)]],
      platformFee: [0, [Validators.required, Validators.min(0)]],
      platformFeePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: [true]
    });

    // Calculate platform fee percentage when price per hour changes
    this.serviceForm.get('pricePerHour')?.valueChanges.subscribe(price => {
      const platformFee = this.serviceForm.get('platformFee')?.value;
      if (price > 0 && platformFee > 0) {
        const percentage = (platformFee / price) * 100;
        this.serviceForm.patchValue({ platformFeePercentage: percentage }, { emitEvent: false });
      }
    });

    // Calculate platform fee when percentage changes
    this.serviceForm.get('platformFeePercentage')?.valueChanges.subscribe(percentage => {
      const pricePerHour = this.serviceForm.get('pricePerHour')?.value;
      if (pricePerHour > 0 && percentage > 0) {
        const fee = (pricePerHour * percentage) / 100;
        this.serviceForm.patchValue({ platformFee: fee }, { emitEvent: false });
      }
    });
  }

  openAddService() {
    this.isEditMode = false;
    this.editingService = null;
    this.serviceForm.reset({
      name: '',
      cost: 0,
      pricePerHour: 0,
      platformFee: 0,
      platformFeePercentage: 0,
      status: true
    });
    this.showServiceForm = true;
  }

  openEditService(service: Service) {
    this.isEditMode = true;
    this.editingService = service;
    this.serviceForm.patchValue({
      name: service.name,
      cost: service.cost,
      pricePerHour: service.pricePerHour,
      platformFee: service.platformFee,
      platformFeePercentage: service.platformFeePercentage,
      status: service.status === 'Active'
    });
    this.showServiceForm = true;
  }

  saveService() {
    if (this.serviceForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        life: 3000
      });
      return;
    }

    const formValue = this.serviceForm.value;
    const serviceData: Service = {
      id: this.isEditMode && this.editingService ? this.editingService.id : 'ICCSVM' + (this.services.length + 1).toString().padStart(3, '0'),
      name: formValue.name,
      cost: formValue.cost,
      pricePerHour: formValue.pricePerHour,
      platformFee: formValue.platformFee,
      platformFeePercentage: formValue.platformFeePercentage,
      status: formValue.status ? 'Active' : 'Inactive'
    };

    if (this.isEditMode) {
      // Update existing service
      const index = this.services.findIndex(s => s.id === serviceData.id);
      if (index !== -1) {
        this.services[index] = serviceData;
      }
    } else {
      // Add new service
      this.services.unshift(serviceData);
    }

    this.showServiceForm = false;
    this.messageService.add({
      severity: 'success',
      summary: this.isEditMode ? 'Service Updated' : 'Service Created',
      detail: this.isEditMode ? 'Service has been updated successfully' : 'New service has been created successfully',
      life: 5000
    });
  }

  toggleServiceStatus(service: Service) {
    service.status = service.status === 'Active' ? 'Inactive' : 'Active';
    this.messageService.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Service ${service.status === 'Active' ? 'activated' : 'deactivated'}`,
      life: 3000
    });
  }

  getSeverity(status: string) {
    return status === 'Active' ? 'success' : 'danger';
  }

  calculatePlatformFee() {
    const pricePerHour = this.serviceForm.get('pricePerHour')?.value;
    const platformFee = this.serviceForm.get('platformFee')?.value;
    
    if (pricePerHour > 0 && platformFee > 0) {
      const percentage = (platformFee / pricePerHour) * 100;
      this.serviceForm.patchValue({ platformFeePercentage: percentage });
    }
  }

  calculatePlatformFeeFromPercentage() {
    const pricePerHour = this.serviceForm.get('pricePerHour')?.value;
    const percentage = this.serviceForm.get('platformFeePercentage')?.value;
    
    if (pricePerHour > 0 && percentage > 0) {
      const fee = (pricePerHour * percentage) / 100;
      this.serviceForm.patchValue({ platformFee: fee });
    }
  }
}