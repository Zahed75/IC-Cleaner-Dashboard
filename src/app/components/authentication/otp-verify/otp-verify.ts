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
  selector: 'app-otp-verify',
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
  templateUrl: './otp-verify.html',
  styleUrls: ['./otp-verify.css']
})
export class OtpVerify {
  otp: string[] = ['', '', '', ''];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  onOtpInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = this.otp[index];
      return;
    }

    // Update OTP array
    this.otp[index] = value;

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }

    // Auto-submit when all fields are filled
    if (this.otp.every(digit => digit !== '')) {
      this.verifyOtp();
    }
  }

  onKeyDown(event: any, index: number): void {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    
    if (pastedData && /^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        if (index < 4) {
          this.otp[index] = digit;
        }
      });
      
      // Focus the last input
      const lastInput = document.getElementById('otp-3');
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
      
      // Auto-verify
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  verifyOtp(): void {
    const otpValue = this.otp.join('');
    
    if (otpValue.length !== 4) {
      this.errorMessage = 'Please enter all 4 digits';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      // For demo purposes, assume OTP is correct if it's "1234"
      if (otpValue === '1234') {
        this.successMessage = 'OTP verified successfully!';
        // Redirect or perform next action here
        console.log('OTP verified successfully');
      } else {
        this.errorMessage = 'Invalid OTP. Please try again.';
        // Clear OTP fields on error
        this.otp = ['', '', '', ''];
        
        // Focus first input
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0');
          if (firstInput) {
            (firstInput as HTMLInputElement).focus();
          }
        }, 100);
      }
    }, 2000);
  }

  resendOtp(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate resend OTP API call
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'New OTP sent to your email!';
      
      // Clear existing OTP
      this.otp = ['', '', '', ''];
      
      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) {
          (firstInput as HTMLInputElement).focus();
        }
      }, 100);
    }, 1500);
  }
}