import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG standalone components
import { Button } from 'primeng/button';
import { Card, CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { 
  CleanerService, 
  Cleaner, 
  CreateCleanerRequest, 
  UpdateCleanerRequest,
  UserResponse
} from '../../../services/cleaner/cleaner-service';

@Component({
  selector: 'app-cleaners',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    CardModule,
    TableModule,
    Tag,
    Dialog,
    Toast,
    InputText,
    ToggleSwitch,
    FileUpload,
    ProgressSpinner,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './cleaners.html',
  styleUrls: ['./cleaners.css']
})
export class Cleaners implements OnInit {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private cleanerService = inject(CleanerService);

  cleanerForm: FormGroup;
  showCleanerForm = false;
  showCleanerDetailsDialog = false;
  isEditMode = false;
  editingCleaner: Cleaner | null = null;
  selectedCleaner: any = null;
  isLoading = false;
  isSubmitting = false;
  isLoadingDetails = false;

  cleaners: Cleaner[] = [];

  constructor() {
    this.cleanerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      country: ['USA', [Validators.required]],
      password: ['', this.isEditMode ? [] : [Validators.required]],
      dba_verification: [false]
    });
  }

  ngOnInit() {
    this.loadCleaners();
  }

  // Load all cleaners from API
  loadCleaners() {
    this.isLoading = true;
    this.cleanerService.getCleaners().subscribe({
      next: (response) => {
        this.cleaners = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading cleaners:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load cleaners',
          life: 5000
        });
        this.isLoading = false;
      }
    });
  }

  // Show cleaner details when clicking on cleaner ID
  showCleanerDetails(cleaner: Cleaner) {
    this.isLoadingDetails = true;
    this.showCleanerDetailsDialog = true;
    
    this.cleanerService.getCleanerById(cleaner.id).subscribe({
      next: (response: UserResponse) => {
        this.selectedCleaner = response.data;
        this.isLoadingDetails = false;
      },
      error: (error: any) => {
        console.error('Error loading cleaner details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load cleaner details',
          life: 5000
        });
        this.isLoadingDetails = false;
        // Fallback to basic cleaner data if API fails
        this.selectedCleaner = {
          id: cleaner.id,
          email: cleaner.email,
          username: cleaner.username,
          first_name: cleaner.first_name,
          last_name: cleaner.last_name,
          is_active: cleaner.is_active,
          role: 'cleaner',
          status: cleaner.profile.status,
          phone_number: cleaner.profile.phone_number,
          is_verified: cleaner.profile.is_verified,
          city: cleaner.profile.city,
          state: cleaner.profile.state,
          country: cleaner.profile.country,
          created_at: cleaner.profile.created_at,
          dba_verification: cleaner.profile.dba_verification,
          rating: parseFloat(cleaner.profile.rating),
          total_services_done: cleaner.profile.total_services_done,
          pending_services: cleaner.profile.pending_services
        };
      }
    });
  }

  openAddCleaner() {
    this.isEditMode = false;
    this.editingCleaner = null;
    this.cleanerForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      city: '',
      state: '',
      country: 'USA',
      password: '',
      dba_verification: false
    });
    this.showCleanerForm = true;
  }

  openEditCleaner(cleaner: Cleaner) {
    this.isEditMode = true;
    this.editingCleaner = cleaner;
    this.cleanerForm.patchValue({
      first_name: cleaner.first_name,
      last_name: cleaner.last_name,
      email: cleaner.email,
      phone_number: cleaner.profile.phone_number,
      city: cleaner.profile.city,
      state: cleaner.profile.state,
      country: cleaner.profile.country,
      dba_verification: cleaner.profile.dba_verification,
      password: '' // Password is optional for updates
    });
    this.showCleanerForm = true;
  }

  saveCleaner() {
    if (this.cleanerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.cleanerForm.value;

    if (this.isEditMode && this.editingCleaner) {
      // Update existing cleaner
      const updateData: UpdateCleanerRequest = {
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        phone_number: formValue.phone_number,
        role: 'cleaner',
        city: formValue.city,
        state: formValue.state,
        country: formValue.country,
        dba_verification: formValue.dba_verification
      };

      // Only include password if provided
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      this.cleanerService.updateCleaner(this.editingCleaner.id, updateData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showCleanerForm = false;
          this.loadCleaners(); // Reload cleaners list
          this.messageService.add({
            severity: 'success',
            summary: 'Cleaner Updated',
            detail: response.message,
            life: 5000
          });
        },
        error: (error: any) => {
          console.error('Error updating cleaner:', error);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: error.message || 'Failed to update cleaner',
            life: 5000
          });
        }
      });
    } else {
      // Create new cleaner
      const createData: CreateCleanerRequest = {
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        phone_number: formValue.phone_number,
        role: 'cleaner',
        password: formValue.password,
        city: formValue.city,
        state: formValue.state,
        country: formValue.country,
        dba_verification: formValue.dba_verification
      };

      this.cleanerService.createCleaner(createData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showCleanerForm = false;
          this.loadCleaners(); // Reload cleaners list
          this.messageService.add({
            severity: 'success',
            summary: 'Cleaner Created',
            detail: response.message,
            life: 5000
          });
        },
        error: (error: any) => {
          console.error('Error creating cleaner:', error);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: error.message || 'Failed to create cleaner',
            life: 5000
          });
        }
      });
    }
  }

  toggleCleanerStatus(cleaner: Cleaner) {
    this.cleanerService.toggleCleanerStatus(cleaner.id).subscribe({
      next: (response) => {
        // Update the local cleaner status
        cleaner.is_active = response.data.is_active;
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: response.message,
          life: 3000
        });
      },
      error: (error: any) => {
        console.error('Error toggling cleaner status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Status Update Failed',
          detail: error.message || 'Failed to update cleaner status',
          life: 5000
        });
      }
    });
  }

  getSeverity(status: string | boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    if (typeof status === 'boolean') {
      return status ? 'success' : 'danger';
    }
    
    switch (status) {
      case 'Active':
      case 'approved':
        return 'success';
      case 'Pending Approval':
      case 'pending':
        return 'warn';
      case 'Terminated':
      case 'terminated':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusText(cleaner: Cleaner): string {
    if (!cleaner.is_active) {
      return 'Terminated';
    }
    
    switch (cleaner.profile.status) {
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending Approval';
      case 'terminated':
        return 'Terminated';
      default:
        return cleaner.profile.status;
    }
  }

  getRatingStars(rating: string | number): string {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (numRating === 0) return '☆0.0';
    const stars = '★'.repeat(Math.floor(numRating));
    const halfStar = numRating % 1 >= 0.5 ? '½' : '';
    return `${stars}${halfStar}${numRating.toFixed(1)}`;
  }

  getCleanerFullName(cleaner: Cleaner): string {
    return `${cleaner.first_name} ${cleaner.last_name}`.trim();
  }

  getCleanerLocation(cleaner: Cleaner): string {
    return cleaner.profile.city || 'N/A';
  }

  getCleanerPhone(cleaner: Cleaner): string {
    return cleaner.profile.phone_number || 'N/A';
  }

  getCleanerId(cleaner: Cleaner): string {
    return `ICC#${cleaner.id.toString().padStart(5, '0')}`;
  }

  // Helper method to parse float in template
  parseRating(rating: string): number {
    return parseFloat(rating);
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  onUpload(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: 'File has been uploaded successfully',
      life: 3000
    });
  }
}