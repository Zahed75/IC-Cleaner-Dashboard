import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { 
  CustomerProfileService, 
  UserProfileResponse, 
  UpdateCustomerProfileRequest, 
  ChangePasswordRequest,
  ApiResponse 
} from '../../../services/customer-service/settings/customer-profile-service';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  buildingNumber: string;
  localityName: string;
  postTown: string;
  postcode: string;
  state: string;
  country: string;
  newPassword: string;
  repeatPassword: string;
  profilePicture?: string;
}

@Component({
  selector: 'app-customer-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  providers: [MessageService]
})
export class CustomerAccountSettingsComponent implements OnInit {
  selectedFileName: string = '';
  selectedFile: File | null = null;
  loading = false;
  userId: number = 4; // Updated to match your API response user_id
  currentProfile: UserProfileResponse | null = null;
  profilePictureUrl: string = 'assets/images/default-avatar.png';

  userProfile: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    buildingNumber: '',
    localityName: '',
    postTown: '',
    postcode: '',
    state: 'NY',
    country: 'USA',
    newPassword: '',
    repeatPassword: ''
  };

  constructor(
    private profileService: CustomerProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.profileService.getUserProfile(this.userId).subscribe({
      next: (response: ApiResponse<UserProfileResponse>) => {
        if (response.code === 200 && response.data) {
          this.currentProfile = response.data;
          this.populateProfileData(response.data);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.showError('Failed to load profile data');
        this.loading = false;
      }
    });
  }

  private populateProfileData(profile: UserProfileResponse): void {
    this.userProfile.firstName = profile.user_info.first_name;
    this.userProfile.lastName = profile.user_info.last_name;
    this.userProfile.email = profile.user_info.email;
    this.userProfile.phoneNumber = profile.profile_info.phone_number;
    this.userProfile.buildingNumber = profile.profile_info.address.address_line1;
    this.userProfile.localityName = profile.profile_info.address.address_line2 || '';
    this.userProfile.postTown = profile.profile_info.address.city;
    this.userProfile.postcode = profile.profile_info.address.zip_code;
    this.userProfile.state = profile.profile_info.address.state;
    this.userProfile.country = profile.profile_info.address.country;

    // Set profile picture
    if (profile.profile_info.has_profile_picture && profile.profile_info.profile_picture_url) {
      this.profilePictureUrl = profile.profile_info.profile_picture_url;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showError('File size should be less than 5MB');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) return;

    this.loading = true;
    this.profileService.updateProfilePicture(this.selectedFile).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          this.showSuccess('Profile picture updated successfully!');
          this.selectedFile = null;
          this.selectedFileName = '';
          // Update profile picture URL from response
          if (response.data.profile_picture_url) {
            this.profilePictureUrl = response.data.profile_picture_url;
          }
        } else {
          this.showError('Failed to update profile picture: ' + response.message);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error uploading profile picture:', error);
        this.showError('Failed to upload profile picture');
        this.loading = false;
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    fileInput.click();
  }

  saveChanges(): void {
    if (this.validateForm()) {
      this.updateProfileAndPassword();
    }
  }

  private validateForm(): boolean {
    // Check if new passwords match if provided
    if (this.userProfile.newPassword && this.userProfile.newPassword !== this.userProfile.repeatPassword) {
      this.showError('New passwords do not match');
      return false;
    }

    // Check password strength if changing password
    if (this.userProfile.newPassword && this.userProfile.newPassword.length < 8) {
      this.showError('New password must be at least 8 characters long');
      return false;
    }

    // Validate required fields
    if (!this.userProfile.firstName || !this.userProfile.lastName || !this.userProfile.phoneNumber || 
        !this.userProfile.buildingNumber || !this.userProfile.postTown || !this.userProfile.postcode ||
        !this.userProfile.state || !this.userProfile.country) {
      this.showError('Please fill in all required fields');
      return false;
    }

    return true;
  }

  private updateProfileAndPassword(): void {
    this.loading = true;

    // Update profile first
    const profileData: UpdateCustomerProfileRequest = {
      first_name: this.userProfile.firstName,
      last_name: this.userProfile.lastName,
      phone_number: this.userProfile.phoneNumber,
      address_line1: this.userProfile.buildingNumber,
      address_line2: this.userProfile.localityName,
      city: this.userProfile.postTown,
      state: this.userProfile.state,
      zip_code: this.userProfile.postcode,
      country: this.userProfile.country // Include country in the request
    };

    this.profileService.updateCustomerProfile(profileData).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          // If password is being changed, update it after profile update
          if (this.userProfile.newPassword) {
            this.changePassword();
          } else {
            this.showSuccess('Profile updated successfully!');
            this.loading = false;
          }
        } else {
          this.showError('Failed to update profile: ' + response.message);
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.showError('Failed to update profile');
        this.loading = false;
      }
    });
  }

  private changePassword(): void {
    const passwordData: ChangePasswordRequest = {
      new_password: this.userProfile.newPassword,
      confirm_new_password: this.userProfile.repeatPassword
    };

    this.profileService.changePassword(passwordData).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          this.showSuccess('Profile and password updated successfully!');
          // Clear password fields
          this.userProfile.newPassword = '';
          this.userProfile.repeatPassword = '';
        } else {
          this.showError('Profile updated but failed to change password: ' + response.message);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error changing password:', error);
        this.showError('Profile updated but failed to change password');
        this.loading = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}