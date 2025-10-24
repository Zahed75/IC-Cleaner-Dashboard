import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  buildingNumber: string;
  localityName: string;
  postTown: string;
  postcode: string;
  password: string;
  repeatPassword: string;
  profilePicture?: string;
}

@Component({
  selector: 'app-customer-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class CustomerAccountSettingsComponent {
  selectedFileName: string = '';
  userProfile: UserProfile = {
    firstName: 'Joey',
    lastName: 'Tribblany',
    email: 'joeytribbian@friends.com',
    phoneNumber: '+446234567890',
    buildingNumber: '1 Chapel Hill',
    localityName: 'Heswall',
    postTown: 'Bournemouth',
    postcode: 'BIH 1AA',
    password: '',
    repeatPassword: ''
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    fileInput.click();
  }

  saveChanges(): void {
    if (this.userProfile.password && this.userProfile.password !== this.userProfile.repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Saving profile:', this.userProfile);
    alert('Profile updated successfully!');
    
    if (this.userProfile.password) {
      this.userProfile.password = '';
      this.userProfile.repeatPassword = '';
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      alert('Logged out successfully!');
    }
  }
}