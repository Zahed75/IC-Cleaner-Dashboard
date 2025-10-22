import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class CleanerSettingsComponent {
  profileData = {
    firstName: 'Joey',
    lastName: 'Tribblany',
    email: 'joeytribbiani@friends.com',
    phone: '+446234567890',
    buildingNumber: '1 Chapel Hill',
    locality: 'Heswall',
    postTown: 'Bournemouth',
    postcode: 'BH1 1AA',
    password: '',
    repeatPassword: '',
    paymentMethod: 'paypal',
    paypalEmail: 'hello@paypal.com',
    // Bank transfer fields
    beneficiary: 'Friends Global Ltd.',
    bankAddress: '133 Houndsditch, LONDON, EC3A 7BX',
    sortCode: '013972',
    bankName: 'Clear Bank',
    accountNumber: '00165374',
    iban: 'GB44CLRB04097200005667'
  };

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected file:', file.name);
    }
  }

  saveChanges() {
    console.log('Saving changes:', this.profileData);
    // Add your save logic here
    alert('Profile updated successfully!');
  }
}