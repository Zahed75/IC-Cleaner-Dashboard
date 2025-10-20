import { Component, inject, OnInit } from '@angular/core';
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
import { ProgressSpinner } from 'primeng/progressspinner';

import { MessageService } from 'primeng/api';
import { ServiceManagementService, Service, CreateServiceRequest, UpdateServiceRequest } from '../../../services/services/service-management';

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
    ToggleSwitch,
    ProgressSpinner
],
  providers: [MessageService],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private serviceManagementService = inject(ServiceManagementService);

  serviceForm: FormGroup;
  showServiceForm = false;
  isEditMode = false;
  editingService: Service | null = null;
  isLoading = false;
  isSubmitting = false;

  services: Service[] = [];

  constructor() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price_per_hour: [0, [Validators.required, Validators.min(0)]],
      platform_fee_per_hour: [0, [Validators.required, Validators.min(0)]],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.loadServices();
  }

  // Load all services from API
  loadServices() {
    this.isLoading = true;
    this.serviceManagementService.getServices().subscribe({
      next: (response) => {
        this.services = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load services',
          life: 5000
        });
        this.isLoading = false;
      }
    });
  }

  openAddService() {
    this.isEditMode = false;
    this.editingService = null;
    this.serviceForm.reset({
      name: '',
      price_per_hour: 0,
      platform_fee_per_hour: 0,
      is_active: true
    });
    this.showServiceForm = true;
  }

  openEditService(service: Service) {
    this.isEditMode = true;
    this.editingService = service;
    this.serviceForm.patchValue({
      name: service.name,
      price_per_hour: parseFloat(service.price_per_hour),
      platform_fee_per_hour: parseFloat(service.platform_fee_per_hour),
      is_active: service.is_active
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

    this.isSubmitting = true;
    const formValue = this.serviceForm.value;

    if (this.isEditMode && this.editingService) {
      // Update existing service
      const updateData: UpdateServiceRequest = {
        name: formValue.name,
        price_per_hour: formValue.price_per_hour,
        platform_fee_per_hour: formValue.platform_fee_per_hour,
        is_active: formValue.is_active
      };

      this.serviceManagementService.updateService(this.editingService.id, updateData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showServiceForm = false;
          this.loadServices(); // Reload the services list
          this.messageService.add({
            severity: 'success',
            summary: 'Service Updated',
            detail: response.message,
            life: 5000
          });
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: error.error?.message || 'Failed to update service',
            life: 5000
          });
        }
      });
    } else {
      // Create new service
      const createData: CreateServiceRequest = {
        name: formValue.name,
        price_per_hour: formValue.price_per_hour,
        platform_fee_per_hour: formValue.platform_fee_per_hour,
        is_active: formValue.is_active
      };

      this.serviceManagementService.createService(createData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showServiceForm = false;
          this.loadServices(); // Reload the services list
          this.messageService.add({
            severity: 'success',
            summary: 'Service Created',
            detail: 'Service has been created successfully',
            life: 5000
          });
        },
        error: (error) => {
          console.error('Error creating service:', error);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: error.error?.message || 'Failed to create service',
            life: 5000
          });
        }
      });
    }
  }

  toggleServiceStatus(service: Service) {
    const newStatus = !service.is_active;
    
    this.serviceManagementService.toggleServiceStatus(service.id, newStatus).subscribe({
      next: (response) => {
        service.is_active = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: response.message,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error updating service status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: error.error?.message || 'Failed to update service status',
          life: 5000
        });
      }
    });
  }

  getSeverity(status: boolean) {
    return status ? 'success' : 'danger';
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  // Helper method to format currency
  formatCurrency(amount: string): number {
    return parseFloat(amount);
  }
}