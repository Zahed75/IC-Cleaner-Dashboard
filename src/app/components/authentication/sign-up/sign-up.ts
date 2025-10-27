import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviornments/environment';

interface RegistrationResponse {
  message: string;
  email: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    MessageModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    DividerModule
  ],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})
export class SignUp {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  repeatPassword: string = '';
  userType: string = 'customer';
  acceptTerms: boolean = false;
  acceptOffers: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepend +44 if not already included
    let phoneNumber = this.phoneNumber.trim();
    if (!phoneNumber.startsWith('+44')) {
      // Remove any existing + sign and prepend +44
      phoneNumber = '+44' + phoneNumber.replace(/^\+/, '');
    }

    const registrationData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone_number: phoneNumber,
      password: this.password,
      password_confirm: this.repeatPassword
    };

    // Determine the endpoint based on user type
    const endpoint = this.userType === 'customer' 
      ? `${environment.baseURL}/auths/api/register/customer/`
      : `${environment.baseURL}/auths/api/register/cleaner/`;

    this.http.post<RegistrationResponse>(endpoint, registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Store email for OTP verification
        localStorage.setItem('pendingVerificationEmail', this.email);
        localStorage.setItem('userType', this.userType);
        
        // Redirect to OTP verification page after a short delay
        setTimeout(() => {
          this.router.navigate(['/otp-verify']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        if (error.error) {
          // Handle specific error messages from backend
          if (error.error.email) {
            this.errorMessage = `Email error: ${error.error.email[0]}`;
          } else if (error.error.phone_number) {
            this.errorMessage = `Phone number error: ${error.error.phone_number[0]}`;
          } else if (error.error.password) {
            this.errorMessage = `Password error: ${error.error.password[0]}`;
          } else if (error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        } else {
          this.errorMessage = 'Registration failed. Please check your connection and try again.';
        }
      }
    });
  }

  private validateForm(): boolean {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Required fields validation
    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber || !this.password || !this.repeatPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Password match validation
    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    // Password length validation
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    // Password strength validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(this.password)) {
      this.errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    // Phone number validation for UK format
    const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    let cleanPhoneNumber = this.phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If it starts with 0, replace with +44 for validation
    if (cleanPhoneNumber.startsWith('0')) {
      cleanPhoneNumber = '+44' + cleanPhoneNumber.substring(1);
    }
    
    if (!phoneRegex.test(cleanPhoneNumber)) {
      this.errorMessage = 'Please enter a valid UK phone number (e.g., +447911123456 or 07911123456)';
      return false;
    }

    // Terms acceptance validation
    if (!this.acceptTerms) {
      this.errorMessage = 'Please accept the terms of use';
      return false;
    }

    return true;
  }
}