import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css']
})
export class ForgetPassword {
  emailOrPhone: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate API call to send reset password link/OTP
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Reset password instructions have been sent to your email/phone!';
      
      // In a real app, you would redirect to OTP verification page
      console.log('Reset password request sent for:', this.emailOrPhone);
    }, 2000);
  }

  private validateForm(): boolean {
    if (!this.emailOrPhone) {
      this.errorMessage = 'Please enter your email address or phone number';
      return false;
    }

    // Basic validation for email or phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; // Basic international phone number validation
    
    if (!emailRegex.test(this.emailOrPhone) && !phoneRegex.test(this.emailOrPhone.replace(/[\s\-\(\)]/g, ''))) {
      this.errorMessage = 'Please enter a valid email address or phone number';
      return false;
    }

    return true;
  }
}