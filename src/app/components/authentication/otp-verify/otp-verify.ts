import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviornments/environment';

interface OtpVerificationResponse {
  message: string;
}

interface ResendOtpResponse {
  code: number;
  message: string;
  data: {
    user_id: number;
    otp: string;
    email: string;
    phone_number: string;
    email_sent: boolean;
    message: string;
    expires_in: string;
    otp_created_at: string;
  };
}

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
export class OtpVerify implements OnInit {
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  
  isLoading: boolean = false;
  isResending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';
  userType: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get email from localStorage
    this.email = localStorage.getItem('pendingVerificationEmail') || '';
    this.userType = localStorage.getItem('userType') || 'customer';
    
    if (!this.email) {
      this.errorMessage = 'No pending verification found. Please register first.';
      setTimeout(() => {
        this.router.navigate(['/sign-up']);
      }, 3000);
    }
  }

  onInput(event: any, currentIndex: number): void {
    const input = event.target;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d?$/.test(value)) {
      input.value = '';
      this.updateOtpValue(currentIndex, '');
      return;
    }

    // Update the OTP value
    this.updateOtpValue(currentIndex, value);

    // Auto-focus next input if a digit was entered
    if (value && currentIndex < 6) {
      const nextInput = document.getElementById(`otp-${currentIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }

    // Auto-verify when all fields are filled
    if (this.getOtpValue().length === 6) {
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  onKeyDown(event: any, currentIndex: number): void {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (!this.getOtpValueByIndex(currentIndex) && currentIndex > 1) {
        // If current field is empty, move to previous field
        event.preventDefault();
        const prevInput = document.getElementById(`otp-${currentIndex - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
        }
      }
    }
    
    // Handle arrow keys for navigation
    if (event.key === 'ArrowLeft' && currentIndex > 1) {
      event.preventDefault();
      const prevInput = document.getElementById(`otp-${currentIndex - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
    
    if (event.key === 'ArrowRight' && currentIndex < 6) {
      event.preventDefault();
      const nextInput = document.getElementById(`otp-${currentIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      
      // Manually set each OTP field
      this.otp1 = digits[0] || '';
      this.otp2 = digits[1] || '';
      this.otp3 = digits[2] || '';
      this.otp4 = digits[3] || '';
      this.otp5 = digits[4] || '';
      this.otp6 = digits[5] || '';
      
      // Update input values manually
      for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
        if (input) {
          input.value = digits[i - 1] || '';
        }
      }
      
      // Focus the last input
      const lastInput = document.getElementById('otp-6');
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
      
      // Auto-verify
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  onFocus(event: any): void {
    // Select the text when focusing on an input
    event.target.select();
  }

  private updateOtpValue(index: number, value: string): void {
    switch(index) {
      case 1: this.otp1 = value; break;
      case 2: this.otp2 = value; break;
      case 3: this.otp3 = value; break;
      case 4: this.otp4 = value; break;
      case 5: this.otp5 = value; break;
      case 6: this.otp6 = value; break;
    }
  }

  private getOtpValueByIndex(index: number): string {
    switch(index) {
      case 1: return this.otp1;
      case 2: return this.otp2;
      case 3: return this.otp3;
      case 4: return this.otp4;
      case 5: return this.otp5;
      case 6: return this.otp6;
      default: return '';
    }
  }

  getOtpValue(): string {
    return this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
  }

  verifyOtp(): void {
    const otpValue = this.getOtpValue();
    
    if (otpValue.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'Email not found. Please register again.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const verificationData = {
      email: this.email,
      otp: otpValue
    };

    this.http.post<OtpVerificationResponse>(
      `${environment.baseURL}/auths/api/verify-email-otp/`,
      verificationData
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Clear stored data
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('userType');
        
        // Redirect to login page after success
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('OTP verification error:', error);
        
        if (error.error) {
          if (error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error.otp) {
            this.errorMessage = `OTP error: ${error.error.otp[0]}`;
          } else if (error.error.email) {
            this.errorMessage = `Email error: ${error.error.email[0]}`;
          } else {
            this.errorMessage = 'OTP verification failed. Please try again.';
          }
        } else {
          this.errorMessage = 'OTP verification failed. Please check your connection and try again.';
        }
        
        // Clear OTP fields on error
        this.clearOtpFields();
      }
    });
  }

  private clearOtpFields(): void {
    this.otp1 = '';
    this.otp2 = '';
    this.otp3 = '';
    this.otp4 = '';
    this.otp5 = '';
    this.otp6 = '';
    
    // Clear input values
    for (let i = 1; i <= 6; i++) {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
    
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById('otp-1');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }, 100);
  }

  resendOtp(): void {
    if (!this.email) {
      this.errorMessage = 'Email not found. Please register again.';
      return;
    }

    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    const resendData = {
      email: this.email
    };

    this.http.post<ResendOtpResponse>(
      `${environment.baseURL}/auths/api/user/resend-otp/`,
      resendData
    ).subscribe({
      next: (response) => {
        this.isResending = false;
        if (response.code === 200) {
          this.successMessage = response.data.message || 'New OTP sent to your email!';
          this.clearOtpFields();
        } else {
          this.errorMessage = response.message || 'Failed to resend OTP. Please try again.';
        }
      },
      error: (error) => {
        this.isResending = false;
        console.error('Resend OTP error:', error);
        
        if (error.error) {
          if (error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error.email) {
            this.errorMessage = `Email error: ${error.error.email[0]}`;
          } else {
            this.errorMessage = 'Failed to resend OTP. Please try again.';
          }
        } else {
          this.errorMessage = 'Failed to resend OTP. Please check your connection and try again.';
        }
      }
    });
  }
}