import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';

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

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Handle successful registration here
      console.log('Registration successful', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        userType: this.userType,
        acceptOffers: this.acceptOffers
      });
    }, 2000);
  }

  private validateForm(): boolean {
    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Please accept the terms of use';
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }
}