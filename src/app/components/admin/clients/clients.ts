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

interface Client {
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
}

@Component({
  selector: 'app-clients',
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
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients{
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  clientForm: FormGroup;
  showClientForm = false;
  isEditMode = false;
  editingClient: Client | null = null;

  clients: Client[] = [
    {
      id: 'ICCS#25081',
      firstName: 'Assign',
      lastName: 'Cleaner',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'Downtown',
      lifetimeBill: 299.99,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25082',
      firstName: 'Assign',
      lastName: 'Cleaner',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'Uptown',
      lifetimeBill: 349.99,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25083',
      firstName: 'Joey',
      lastName: 'Tribbiani',
      email: 'joeytribbian@friends.com',
      phone: '+446234567890',
      location: 'Midtown',
      lifetimeBill: 399.99,
      status: 'Active',
      buildingNumber: '1',
      streetName: 'Chapel Hill',
      localityName: 'Heswall',
      postTown: 'Bournemouth',
      postCode: 'BH1 1AA'
    },
    {
      id: 'ICCS#25084',
      firstName: 'Chandler',
      lastName: 'Bing',
      email: 'chandler.bing@friends.com',
      phone: '(555) 123-4567',
      location: 'Eastside',
      lifetimeBill: 249.99,
      status: 'Terminated',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25085',
      firstName: 'Monica',
      lastName: 'Geller',
      email: 'monica.geller@friends.com',
      phone: '(555) 123-4567',
      location: 'Westend',
      lifetimeBill: 279.99,
      status: 'Terminated',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25086',
      firstName: 'Rachel',
      lastName: 'Green',
      email: 'rachel.green@friends.com',
      phone: '(555) 123-4567',
      location: 'Riverside',
      lifetimeBill: 219.99,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25087',
      firstName: 'Ross',
      lastName: 'Geller',
      email: 'ross.geller@friends.com',
      phone: '(555) 123-4567',
      location: 'Lakeshore',
      lifetimeBill: 399.00,
      status: 'Active',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    },
    {
      id: 'ICCS#25088',
      firstName: 'Phoebe',
      lastName: 'Buffay',
      email: 'phoebe.buffay@friends.com',
      phone: '(555) 123-4567',
      location: 'Greenville',
      lifetimeBill: 499.99,
      status: 'Terminated',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: ''
    }
  ];

  constructor() {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      location: ['', [Validators.required]],
      buildingNumber: [''],
      streetName: [''],
      localityName: [''],
      postTown: [''],
      postCode: [''],
      password: [''],
      repeatPassword: [''],
      status: [true]
    });
  }

  openAddClient() {
    this.isEditMode = false;
    this.editingClient = null;
    this.clientForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      buildingNumber: '',
      streetName: '',
      localityName: '',
      postTown: '',
      postCode: '',
      password: '',
      repeatPassword: '',
      status: true
    });
    this.showClientForm = true;
  }

  openEditClient(client: Client) {
    this.isEditMode = true;
    this.editingClient = client;
    this.clientForm.patchValue({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      location: client.location,
      buildingNumber: client.buildingNumber,
      streetName: client.streetName,
      localityName: client.localityName,
      postTown: client.postTown,
      postCode: client.postCode,
      status: client.status === 'Active'
    });
    this.showClientForm = true;
  }

  saveClient() {
    if (this.clientForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        life: 3000
      });
      return;
    }

    const formValue = this.clientForm.value;
    const clientData: Client = {
      id: this.isEditMode && this.editingClient ? this.editingClient.id : 'ICCS#' + (this.clients.length + 1).toString().padStart(5, '0'),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      location: formValue.location,
      lifetimeBill: this.isEditMode && this.editingClient ? this.editingClient.lifetimeBill : 0,
      status: formValue.status ? 'Active' : 'Terminated',
      buildingNumber: formValue.buildingNumber,
      streetName: formValue.streetName,
      localityName: formValue.localityName,
      postTown: formValue.postTown,
      postCode: formValue.postCode
    };

    if (this.isEditMode) {
      const index = this.clients.findIndex(c => c.id === clientData.id);
      if (index !== -1) {
        this.clients[index] = clientData;
      }
    } else {
      this.clients.unshift(clientData);
    }

    this.showClientForm = false;
    this.messageService.add({
      severity: 'success',
      summary: this.isEditMode ? 'Client Updated' : 'Client Created',
      detail: this.isEditMode ? 'Client has been updated successfully' : 'New client has been created successfully',
      life: 5000
    });
  }

  toggleClientStatus(client: Client) {
    client.status = client.status === 'Active' ? 'Terminated' : 'Active';
    this.messageService.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Client status changed to ${client.status}`,
      life: 3000
    });
  }

  getSeverity(status: string) {
    return status === 'Active' ? 'success' : 'danger';
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