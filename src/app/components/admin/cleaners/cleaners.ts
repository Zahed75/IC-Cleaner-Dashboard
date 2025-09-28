import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG standalone components
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';

import { MessageService } from 'primeng/api';

interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  status: 'Active' | 'Pending Approval' | 'Terminated';
  buildingNumber: string;
  streetName: string;
  postTown: string;
  postCode: string;
}

@Component({
  selector: 'app-cleaners',
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
 
    ToggleSwitch,
    FileUpload
  ],
  providers: [MessageService],
  templateUrl: './cleaners.html',
  styleUrls: ['./cleaners.css']
})
export class Cleaners {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  cleanerForm: FormGroup;
  showCleanerForm = false;
  isEditMode = false;
  editingCleaner: Cleaner | null = null;

  cleaners: Cleaner[] = [
    {
      id: 'ICC#25081',
      name: 'Assign Cleaner',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'Downtown',
      rating: 4.9,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25082',
      name: 'Assign Cleaner',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'Uptown',
      rating: 0.0,
      status: 'Pending Approval',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25083',
      name: 'Joey Tribbiani',
      email: 'joeytribbian@friends.com',
      phone: '(555) 123-4567',
      location: 'Midtown',
      rating: 3.8,
      status: 'Terminated',
      buildingNumber: '1',
      streetName: 'Chapel Hill',
      postTown: 'Bournemouth',
      postCode: 'BH1 1AA'
    },
    {
      id: 'ICC#25084',
      name: 'Chandler Bing',
      email: 'chandler.bing@friends.com',
      phone: '(555) 123-4567',
      location: 'Eastside',
      rating: 0.0,
      status: 'Pending Approval',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25085',
      name: 'Monica Geller',
      email: 'monica.geller@friends.com',
      phone: '(555) 123-4567',
      location: 'Westend',
      rating: 2.9,
      status: 'Terminated',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25086',
      name: 'Rachel Green',
      email: 'rachel.green@friends.com',
      phone: '(555) 123-4567',
      location: 'Riverside',
      rating: 4.1,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25087',
      name: 'Ross Geller',
      email: 'ross.geller@friends.com',
      phone: '(555) 123-4567',
      location: 'Lakeshore',
      rating: 4.8,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICC#25088',
      name: 'Phoebe Buffay',
      email: 'phoebe.buffay@friends.com',
      phone: '(555) 123-4567',
      location: 'Greenville',
      rating: 3.5,
      status: 'Terminated',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: ''
    }
  ];

  constructor() {
    this.cleanerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      location: ['', [Validators.required]],
      buildingNumber: [''],
      streetName: [''],
      postTown: [''],
      postCode: [''],
      password: [''],
      status: [true]
    });
  }

  openAddCleaner() {
    this.isEditMode = false;
    this.editingCleaner = null;
    this.cleanerForm.reset({
      name: '',
      email: '',
      phone: '',
      location: '',
      buildingNumber: '',
      streetName: '',
      postTown: '',
      postCode: '',
      password: '',
      status: true
    });
    this.showCleanerForm = true;
  }

  openEditCleaner(cleaner: Cleaner) {
    this.isEditMode = true;
    this.editingCleaner = cleaner;
    this.cleanerForm.patchValue({
      name: cleaner.name,
      email: cleaner.email,
      phone: cleaner.phone,
      location: cleaner.location,
      buildingNumber: cleaner.buildingNumber,
      streetName: cleaner.streetName,
      postTown: cleaner.postTown,
      postCode: cleaner.postCode,
      status: cleaner.status === 'Active'
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

    const formValue = this.cleanerForm.value;
    const cleanerData: Cleaner = {
      id: this.isEditMode && this.editingCleaner ? this.editingCleaner.id : 'ICC#' + (this.cleaners.length + 1).toString().padStart(5, '0'),
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      location: formValue.location,
      rating: this.isEditMode && this.editingCleaner ? this.editingCleaner.rating : 0.0,
      status: formValue.status ? 'Active' : 'Pending Approval',
      buildingNumber: formValue.buildingNumber,
      streetName: formValue.streetName,
      postTown: formValue.postTown,
      postCode: formValue.postCode
    };

    if (this.isEditMode) {
      const index = this.cleaners.findIndex(c => c.id === cleanerData.id);
      if (index !== -1) {
        this.cleaners[index] = cleanerData;
      }
    } else {
      this.cleaners.unshift(cleanerData);
    }

    this.showCleanerForm = false;
    this.messageService.add({
      severity: 'success',
      summary: this.isEditMode ? 'Cleaner Updated' : 'Cleaner Created',
      detail: this.isEditMode ? 'Cleaner has been updated successfully' : 'New cleaner has been created successfully',
      life: 5000
    });
  }

  toggleCleanerStatus(cleaner: Cleaner) {
    if (cleaner.status === 'Active') {
      cleaner.status = 'Terminated';
    } else if (cleaner.status === 'Terminated') {
      cleaner.status = 'Active';
    } else {
      cleaner.status = 'Active';
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Cleaner status changed to ${cleaner.status}`,
      life: 3000
    });
  }

getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Pending Approval':
      return 'warn';
    case 'Terminated':
      return 'danger';
    default:
      return 'secondary';
  }
}

  getRatingStars(rating: number): string {
    if (rating === 0) return '☆0.0';
    const stars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '½' : '';
    return `${stars}${halfStar}${rating.toFixed(1)}`;
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