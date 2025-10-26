import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { 
  ProfileService, 
  UserProfileResponse, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  PaymentMethod,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  ApiResponse 
} from '../../../services/cleaner-service/settings/profile-service';

@Component({
  selector: 'cleaner-app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  providers: [MessageService]
})
export class CleanerSettingsComponent implements OnInit {
  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    buildingNumber: '',
    locality: '',
    postTown: '',
    postcode: '',
    state: 'NY',
    country: 'USA',
    password: '',
    repeatPassword: '',
    paymentMethod: 'paypal',
    paypalEmail: '',
    // Bank transfer fields
    beneficiary: '',
    bankAddress: '',
    sortCode: '',
    bankName: '',
    accountNumber: '',
    iban: ''
  };

  selectedFile: File | null = null;
  loading = false;
  userId: number = 6; // You can get this from authentication service or localStorage
  currentProfile: UserProfileResponse | null = null;
  paymentMethods: PaymentMethod[] = [];
  currentPaymentMethod: PaymentMethod | null = null;
  profilePictureUrl: string = 'assets/images/default-avatar.png';

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadPaymentMethods();
  }

  loadUserProfile() {
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

  loadPaymentMethods() {
    this.profileService.getPaymentMethods().subscribe({
      next: (response: ApiResponse<PaymentMethod[]>) => {
        if (response.code === 200 && response.data) {
          this.paymentMethods = response.data;
          // Set the default payment method if available
          const defaultMethod = this.paymentMethods.find(method => method.is_default);
          if (defaultMethod) {
            this.currentPaymentMethod = defaultMethod;
            this.populatePaymentData(defaultMethod);
          }
        }
      },
      error: (error: any) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  private populateProfileData(profile: UserProfileResponse) {
    this.profileData.firstName = profile.user_info.first_name;
    this.profileData.lastName = profile.user_info.last_name;
    this.profileData.email = profile.user_info.email;
    this.profileData.phone = profile.profile_info.phone_number;
    this.profileData.buildingNumber = profile.profile_info.address.address_line1;
    this.profileData.locality = profile.profile_info.address.address_line2 || '';
    this.profileData.postTown = profile.profile_info.address.city;
    this.profileData.postcode = profile.profile_info.address.zip_code;
    this.profileData.state = profile.profile_info.address.state;
    this.profileData.country = profile.profile_info.address.country;

    // Set profile picture
    if (profile.profile_info.has_profile_picture && profile.profile_info.profile_picture_url) {
      this.profilePictureUrl = profile.profile_info.profile_picture_url;
    }
  }

  private populatePaymentData(paymentMethod: PaymentMethod) {
    this.profileData.paymentMethod = paymentMethod.method;
    
    if (paymentMethod.method === 'paypal') {
      this.profileData.paypalEmail = paymentMethod.paypal_email;
    } else if (paymentMethod.method === 'bank_transfer') {
      this.profileData.beneficiary = paymentMethod.beneficiary_name;
      this.profileData.bankAddress = paymentMethod.bank_address;
      this.profileData.sortCode = paymentMethod.sort_code;
      this.profileData.bankName = paymentMethod.bank_name;
      this.profileData.accountNumber = paymentMethod.account_number;
      this.profileData.iban = paymentMethod.iban;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.profileService.updateProfilePicture(this.selectedFile).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          this.showSuccess('Profile picture updated successfully!');
          this.selectedFile = null;
          // Update profile picture URL from response
          if (response.data.profile_picture_url) {
            this.profilePictureUrl = response.data.profile_picture_url;
          }
          // Reset file input
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
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

  saveChanges() {
    if (this.validateForm()) {
      this.updateProfile();
      this.changePasswordIfNeeded();
      this.savePaymentMethod();
    }
  }

  private validateForm(): boolean {
    // Check if passwords match if provided
    if (this.profileData.password && this.profileData.password !== this.profileData.repeatPassword) {
      this.showError('Passwords do not match');
      return false;
    }

    // Check password strength if changing password
    if (this.profileData.password && this.profileData.password.length < 8) {
      this.showError('Password must be at least 8 characters long');
      return false;
    }

    // Validate required fields
    if (!this.profileData.firstName || !this.profileData.lastName || !this.profileData.phone) {
      this.showError('Please fill in all required fields');
      return false;
    }

    // Validate payment method specific fields
    if (this.profileData.paymentMethod === 'paypal' && !this.profileData.paypalEmail) {
      this.showError('PayPal email is required');
      return false;
    }

    if (this.profileData.paymentMethod === 'bank_transfer') {
      if (!this.profileData.beneficiary || !this.profileData.bankName || !this.profileData.accountNumber) {
        this.showError('Beneficiary name, bank name, and account number are required for bank transfer');
        return false;
      }
    }

    return true;
  }

  private updateProfile() {
    const profileData: UpdateProfileRequest = {
      first_name: this.profileData.firstName,
      last_name: this.profileData.lastName,
      phone_number: this.profileData.phone,
      address_line1: this.profileData.buildingNumber,
      city: this.profileData.postTown,
      state: this.profileData.state,
      zip_code: this.profileData.postcode,
      country: this.profileData.country
    };

    this.loading = true;
    this.profileService.updateUserProfile(this.userId, profileData).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          this.showSuccess('Profile updated successfully!');
        } else {
          this.showError('Failed to update profile: ' + response.message);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.showError('Failed to update profile');
        this.loading = false;
      }
    });
  }

  private changePasswordIfNeeded() {
    if (!this.profileData.password) return;

    const passwordData: ChangePasswordRequest = {
      new_password: this.profileData.password,
      confirm_new_password: this.profileData.repeatPassword
    };

    this.profileService.changePassword(passwordData).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.code === 200) {
          this.showSuccess('Password changed successfully!');
          // Clear password fields
          this.profileData.password = '';
          this.profileData.repeatPassword = '';
        } else {
          this.showError('Failed to change password: ' + response.message);
        }
      },
      error: (error: any) => {
        console.error('Error changing password:', error);
        this.showError('Failed to change password');
      }
    });
  }

  private savePaymentMethod() {
    if (this.profileData.paymentMethod === 'paypal') {
      const paymentData: CreatePaymentMethodRequest = {
        method: 'paypal',
        paypal_email: this.profileData.paypalEmail,
        is_default: true
      };

      if (this.currentPaymentMethod) {
        // Update existing payment method
        this.profileService.updatePaymentMethod(this.currentPaymentMethod.id, paymentData).subscribe({
          next: (response: ApiResponse<PaymentMethod>) => {
            if (response.code === 200) {
              this.showSuccess('Payment method updated successfully!');
              this.currentPaymentMethod = response.data;
            } else {
              this.showError('Failed to update payment method: ' + response.message);
            }
          },
          error: (error: any) => {
            console.error('Error updating payment method:', error);
            this.showError('Failed to update payment method');
          }
        });
      } else {
        // Create new payment method
        this.profileService.createPaymentMethod(paymentData).subscribe({
          next: (response: ApiResponse<PaymentMethod>) => {
            if (response.code === 201) {
              this.showSuccess('Payment method created successfully!');
              this.currentPaymentMethod = response.data;
            } else {
              this.showError('Failed to create payment method: ' + response.message);
            }
          },
          error: (error: any) => {
            console.error('Error creating payment method:', error);
            this.showError('Failed to create payment method');
          }
        });
      }
    } else if (this.profileData.paymentMethod === 'bank_transfer') {
      const paymentData: CreatePaymentMethodRequest = {
        method: 'bank_transfer',
        beneficiary_name: this.profileData.beneficiary,
        bank_name: this.profileData.bankName,
        bank_address: this.profileData.bankAddress,
        account_number: this.profileData.accountNumber,
        sort_code: this.profileData.sortCode,
        iban: this.profileData.iban,
        is_default: true
      };

      if (this.currentPaymentMethod) {
        // Update existing payment method
        this.profileService.updatePaymentMethod(this.currentPaymentMethod.id, paymentData).subscribe({
          next: (response: ApiResponse<PaymentMethod>) => {
            if (response.code === 200) {
              this.showSuccess('Payment method updated successfully!');
              this.currentPaymentMethod = response.data;
            } else {
              this.showError('Failed to update payment method: ' + response.message);
            }
          },
          error: (error: any) => {
            console.error('Error updating payment method:', error);
            this.showError('Failed to update payment method');
          }
        });
      } else {
        // Create new payment method
        this.profileService.createPaymentMethod(paymentData).subscribe({
          next: (response: ApiResponse<PaymentMethod>) => {
            if (response.code === 201) {
              this.showSuccess('Payment method created successfully!');
              this.currentPaymentMethod = response.data;
            } else {
              this.showError('Failed to create payment method: ' + response.message);
            }
          },
          error: (error: any) => {
            console.error('Error creating payment method:', error);
            this.showError('Failed to create payment method');
          }
        });
      }
    }
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}