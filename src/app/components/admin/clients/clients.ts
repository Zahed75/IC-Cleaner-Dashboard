import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG standalone components
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ToggleSwitch, ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Password, PasswordModule } from 'primeng/password';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { MessageService } from 'primeng/api';
import { ClientService, Customer, CustomerProfile } from '../../../services/client/client-service';

interface ClientTable {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  lifetimeBill: number;
  status: 'Active' | 'Terminated';
  buildingNumber: string;
  streetName: string;
  localityName: string;
  postTown: string;
  postCode: string;
  originalId?: number;
  state?: string;
  country?: string;
  totalServices?: number;
  pendingServices?: number;
  rating?: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Button,
    Card,
    TableModule,
    Tag,
    Dialog,
    Toast,
    InputTextModule,
    ToggleSwitchModule,
    FileUploadModule,
    PasswordModule,
    ConfirmDialog
  ],
  providers: [MessageService, ClientService, ConfirmationService],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  clientForm: FormGroup;
  showClientForm = false;
  showClientDetailsDialog = false;
  isEditMode = false;
  editingClient: ClientTable | null = null;
  deletingClient: ClientTable | null = null;
  selectedClient: ClientTable | null = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  
  // Loading states
  loading: boolean = false;
  saving: boolean = false;
  deleting: boolean = false;
  loadingDetails: boolean = false;
  
  showDeleteDialog: boolean = false;

  clients: ClientTable[] = [];

  constructor() {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['USA', [Validators.required]],
      buildingNumber: ['', [Validators.required]],
      street: ['', [Validators.required]],
      postCode: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      isActive: [true],
      profilePicture: [null]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.loadClients();
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  loadClients() {
    this.loading = true;
    this.clientService.getCustomers().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          // Transform API data to table format
          this.clients = response.data.map(customer => this.transformCustomerToTable(customer));
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading clients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load clients',
          life: 5000
        });
      }
    });
  }

  // View client details when clicking on ID
  viewClientDetails(client: ClientTable) {
    this.selectedClient = client;
    this.showClientDetailsDialog = true;
  }

  // Edit client from details dialog
  editSelectedClient() {
    if (this.selectedClient) {
      this.openEditClient(this.selectedClient);
      this.showClientDetailsDialog = false;
    }
  }

  private transformCustomerToTable(customer: Customer): ClientTable {
    const profile = customer.profile;
    
    // Parse address_line1 to extract building number and street
    const addressParts = profile.address_line1 ? profile.address_line1.split(',').map(part => part.trim()) : [];
    const buildingNumber = addressParts[0] || '';
    const streetName = addressParts.slice(1).join(', ') || '';
    
    return {
      id: `ICCS#${customer.id.toString().padStart(5, '0')}`,
      firstName: customer.first_name || 'N/A',
      lastName: customer.last_name || 'N/A',
      email: customer.email || customer.username,
      phone: profile.phone_number || 'N/A',
      location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'N/A',
      lifetimeBill: 0, // This field is not in the API response
      status: customer.is_active ? 'Active' : 'Terminated',
      buildingNumber: buildingNumber,
      streetName: streetName,
      localityName: '',
      postTown: profile.city || '',
      postCode: profile.zip_code || '',
      originalId: customer.id,
      state: profile.state,
      country: profile.country,
      totalServices: profile.total_services_done,
      pendingServices: profile.pending_services,
      rating: profile.rating
    };
  }

  private transformTableToApi(client: ClientTable, isCreate: boolean = false): any {
    const formData: any = {
      email: client.email,
      first_name: client.firstName,
      last_name: client.lastName,
      phone_number: client.phone,
      city: client.postTown || 'Unknown',
      state: client.state || 'Unknown',
      building_number: client.buildingNumber,
      street: client.streetName,
      post_code: client.postCode,
      country: client.country || 'USA'
    };

    if (isCreate) {
      formData.password = this.clientForm.get('password')?.value || 'Customer123!';
    } else if (this.clientForm.get('password')?.value) {
      // Only include password if it's being changed
      formData.password = this.clientForm.get('password')?.value;
    }

    if (this.selectedFile) {
      formData.profile_picture = this.selectedFile;
    }

    return formData;
  }

  openAddClient() {
    this.isEditMode = false;
    this.editingClient = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    
    // Update validators for create mode
    this.clientForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.clientForm.get('confirmPassword')?.setValidators([Validators.required]);
    
    this.clientForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: 'USA',
      buildingNumber: '',
      street: '',
      postCode: '',
      password: '',
      confirmPassword: '',
      isActive: true,
      profilePicture: null
    });
    this.showClientForm = true;
  }

  openEditClient(client: ClientTable) {
    this.isEditMode = true;
    this.editingClient = client;
    this.selectedFile = null;
    this.selectedFileName = '';
    
    // Update validators for edit mode (optional fields)
    this.clientForm.get('password')?.clearValidators();
    this.clientForm.get('confirmPassword')?.clearValidators();
    
    this.clientForm.get('password')?.setValidators([Validators.minLength(6)]);
    
    // Use the data we already have from the API response
    this.clientForm.patchValue({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phoneNumber: client.phone,
      city: client.postTown,
      state: client.state || '',
      country: client.country || 'USA',
      buildingNumber: client.buildingNumber,
      street: client.streetName,
      postCode: client.postCode,
      password: '',
      confirmPassword: '',
      isActive: client.status === 'Active'
    });
    this.showClientForm = true;
  }

  saveClient() {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        life: 3000
      });
      return;
    }

    this.saving = true;
    const formValue = this.clientForm.value;
    
    const clientTableData: ClientTable = {
      id: this.isEditMode && this.editingClient ? this.editingClient.id : 'ICCS#00000',
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phoneNumber,
      location: `${formValue.city}, ${formValue.state}`,
      lifetimeBill: this.isEditMode && this.editingClient ? this.editingClient.lifetimeBill : 0,
      status: formValue.isActive ? 'Active' : 'Terminated',
      buildingNumber: formValue.buildingNumber,
      streetName: formValue.street,
      localityName: '',
      postTown: formValue.city,
      postCode: formValue.postCode,
      state: formValue.state,
      country: formValue.country
    };

    const apiData = this.transformTableToApi(clientTableData, !this.isEditMode);
    const formData = this.clientService.createFormData(apiData);

    if (this.isEditMode && this.editingClient?.originalId) {
      // Update existing client
      this.clientService.updateClient(this.editingClient.originalId, formData).subscribe({
        next: (response) => {
          this.saving = false;
          if (response.code === 200) {
            // Reload the clients list to get updated data
            this.loadClients();
            this.showClientForm = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Client Updated',
              detail: 'Client has been updated successfully',
              life: 5000
            });
          }
        },
        error: (error) => {
          this.saving = false;
          console.error('Error updating client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Failed to update client. Please check if you are authenticated.',
            life: 5000
          });
        }
      });
    } else {
      // Create new client
      this.clientService.createClient(formData).subscribe({
        next: (response) => {
          this.saving = false;
          if (response.code === 201) {
            // Reload the clients list to get the new client
            this.loadClients();
            this.showClientForm = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Client Created',
              detail: 'New client has been created successfully',
              life: 5000
            });
          }
        },
        error: (error) => {
          this.saving = false;
          console.error('Error creating client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: 'Failed to create client. Please check if you are authenticated.',
            life: 5000
          });
        }
      });
    }
  }

  deleteClient(client: ClientTable) {
    this.deletingClient = client;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (!this.deletingClient?.originalId) return;

    this.deleting = true;
    this.clientService.deleteClient(this.deletingClient.originalId).subscribe({
      next: (response) => {
        this.deleting = false;
        this.showDeleteDialog = false;
        
        // Remove from local array
        const index = this.clients.findIndex(c => c.originalId === this.deletingClient?.originalId);
        if (index !== -1) {
          this.clients.splice(index, 1);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Client Deleted',
          detail: 'Client has been deleted successfully',
          life: 5000
        });
        this.deletingClient = null;
      },
      error: (error) => {
        this.deleting = false;
        console.error('Error deleting client:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Failed to delete client. Please check if you are authenticated.',
          life: 5000
        });
      }
    });
  }

  toggleClientStatus(client: ClientTable) {
    if (!client.originalId) return;

    const newStatus = client.status === 'Active' ? 'Terminated' : 'Active';
    
    // Prepare update data
    const updateData = {
      is_active: newStatus === 'Active'
    };
    
    const formData = this.clientService.createFormData(updateData);

    this.clientService.updateClient(client.originalId, formData).subscribe({
      next: (response) => {
        if (response.code === 200) {
          // Update local data
          client.status = newStatus;
          this.messageService.add({
            severity: 'info',
            summary: 'Status Updated',
            detail: `Client status changed to ${client.status}`,
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error updating client status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Status Update Failed',
          detail: 'Failed to update client status. Please check if you are authenticated.',
          life: 5000
        });
      }
    });
  }

  onUpload(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      this.selectedFileName = this.selectedFile?.name || '';
      this.clientForm.patchValue({
        profilePicture: this.selectedFile
      });
      this.messageService.add({
        severity: 'info',
        summary: 'File Selected',
        detail: 'Profile picture has been selected',
        life: 3000
      });
    }
  }

  onClearFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.clientForm.patchValue({
      profilePicture: null
    });
  }

  onDialogHide() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  getSeverity(status: string) {
    return status === 'Active' ? 'success' : 'danger';
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched() {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  
}