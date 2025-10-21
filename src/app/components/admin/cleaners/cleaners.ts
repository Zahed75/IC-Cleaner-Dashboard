





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

  // File upload variables
  profilePictureFile: File | null = null;
  dbaDocumentFile: File | null = null;

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
      password: [''],
      dba_verification: [false],
      rating: [5],
      total_services_done: [0],
      pending_services: [0]
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
          status: this.getCleanerStatus(cleaner),
          phone_number: this.getCleanerPhone(cleaner),
          is_verified: cleaner.profile?.is_verified || false,
          city: this.getCleanerLocation(cleaner),
          state: this.getCleanerState(cleaner),
          country: this.getCleanerCountry(cleaner),
          created_at: cleaner.profile?.created_at || '',
          dba_verification: this.getDbaVerification(cleaner),
          rating: this.parseRating(this.getCleanerRating(cleaner)),
          total_services_done: this.getTotalServicesDone(cleaner),
          pending_services: this.getPendingServices(cleaner),
          profile_picture: cleaner.profile?.profile_picture || null,
          dba_document: cleaner.profile?.dba_document || null
        };
      }
    });
  }

  openAddCleaner() {
    this.isEditMode = false;
    this.editingCleaner = null;
    this.profilePictureFile = null;
    this.dbaDocumentFile = null;
    this.cleanerForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      city: '',
      state: '',
      country: 'USA',
      password: '',
      dba_verification: false,
      rating: 5,
      total_services_done: 0,
      pending_services: 0
    });
    this.showCleanerForm = true;
  }

  openEditCleaner(cleaner: Cleaner) {
    console.log('Editing cleaner:', cleaner);
    
    this.isEditMode = true;
    this.editingCleaner = cleaner;
    this.profilePictureFile = null;
    this.dbaDocumentFile = null;

    // Get fresh data from API to ensure correct structure
    this.cleanerService.getCleanerById(cleaner.id).subscribe({
      next: (response: UserResponse) => {
        const apiData = response.data;
        
        // Map API response to form
        this.cleanerForm.patchValue({
          first_name: apiData.first_name || '',
          last_name: apiData.last_name || '',
          email: apiData.email || '',
          phone_number: apiData.phone_number || '',
          city: apiData.city || '',
          state: apiData.state || '',
          country: apiData.country || 'USA',
          dba_verification: apiData.dba_verification || false,
          rating: apiData.rating || 5,
          total_services_done: apiData.total_services_done || 0,
          pending_services: apiData.pending_services || 0,
          password: '' // Leave empty for updates
        });
        
        this.showCleanerForm = true;
      },
      error: (error: any) => {
        console.error('Error loading cleaner details for edit:', error);
        
        // Fallback: Use available data
        this.cleanerForm.patchValue({
          first_name: cleaner.first_name || '',
          last_name: cleaner.last_name || '',
          email: cleaner.email || '',
          phone_number: this.getCleanerPhone(cleaner),
          city: this.getCleanerLocation(cleaner),
          state: this.getCleanerState(cleaner),
          country: this.getCleanerCountry(cleaner),
          dba_verification: this.getDbaVerification(cleaner),
          rating: this.parseRating(this.getCleanerRating(cleaner)),
          total_services_done: this.getTotalServicesDone(cleaner),
          pending_services: this.getPendingServices(cleaner),
          password: '' // Leave empty for updates
        });
        
        this.showCleanerForm = true;
        
        this.messageService.add({
          severity: 'warn',
          summary: 'Using Available Data',
          detail: 'Could not load latest details. Using available data.',
          life: 3000
        });
      }
    });
  }

  // Handle profile picture upload
  onProfilePictureUpload(event: any) {
    if (event.files && event.files.length > 0) {
      this.profilePictureFile = event.files[0];
      if (this.profilePictureFile) {
        this.messageService.add({
          severity: 'info',
          summary: 'Profile Picture Selected',
          detail: `File: ${this.profilePictureFile.name}`,
          life: 3000
        });
      }
    }
  }

  // Handle DBA document upload
  onDbaDocumentUpload(event: any) {
    if (event.files && event.files.length > 0) {
      this.dbaDocumentFile = event.files[0];
      if (this.dbaDocumentFile) {
        this.messageService.add({
          severity: 'info',
          summary: 'DBA Document Selected',
          detail: `File: ${this.dbaDocumentFile.name}`,
          life: 3000
        });
      }
    }
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
        dba_verification: formValue.dba_verification,
        rating: formValue.rating,
        total_services_done: formValue.total_services_done,
        pending_services: formValue.pending_services
      };

      // Only include password if provided and not empty
      if (formValue.password && formValue.password.trim() !== '') {
        updateData.password = formValue.password;
      }

      // Add files if they exist
      if (this.profilePictureFile) {
        updateData.profile_picture = this.profilePictureFile;
      }
      if (this.dbaDocumentFile) {
        updateData.dba_document = this.dbaDocumentFile;
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
      // Create new cleaner - password is required
      if (!formValue.password || formValue.password.trim() === '') {
        this.messageService.add({
          severity: 'warn',
          summary: 'Password Required',
          detail: 'Password is required for new cleaners',
          life: 3000
        });
        this.isSubmitting = false;
        return;
      }

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
        dba_verification: formValue.dba_verification,
        rating: formValue.rating,
        total_services_done: formValue.total_services_done,
        pending_services: formValue.pending_services,
        profile_picture: this.profilePictureFile || undefined,
        dba_document: this.dbaDocumentFile || undefined
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
    
    const status = this.getCleanerStatus(cleaner);
    switch (status) {
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending Approval';
      case 'terminated':
        return 'Terminated';
      default:
        return status || 'Unknown';
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
    return cleaner.profile?.city || 'N/A';
  }

  getCleanerPhone(cleaner: Cleaner): string {
    return cleaner.profile?.phone_number || 'N/A';
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

  // Remove file from upload
  removeProfilePicture() {
    this.profilePictureFile = null;
    this.messageService.add({
      severity: 'info',
      summary: 'Profile Picture Removed',
      detail: 'Profile picture has been removed',
      life: 3000
    });
  }

  removeDbaDocument() {
    this.dbaDocumentFile = null;
    this.messageService.add({
      severity: 'info',
      summary: 'DBA Document Removed',
      detail: 'DBA document has been removed',
      life: 3000
    });
  }

  // New helper methods to handle data structure differences
  getCleanerRating(cleaner: Cleaner): string {
    return cleaner.profile?.rating || '0';
  }

  getTotalServicesDone(cleaner: Cleaner): number {
    return cleaner.profile?.total_services_done || 0;
  }

  getPendingServices(cleaner: Cleaner): number {
    return cleaner.profile?.pending_services || 0;
  }

  getCleanerStatus(cleaner: Cleaner): string {
    return cleaner.profile?.status || '';
  }

  getCleanerState(cleaner: Cleaner): string {
    return cleaner.profile?.state || '';
  }

  getCleanerCountry(cleaner: Cleaner): string {
    return cleaner.profile?.country || 'USA';
  }

  getDbaVerification(cleaner: Cleaner): boolean {
    return cleaner.profile?.dba_verification || false;
  }
}