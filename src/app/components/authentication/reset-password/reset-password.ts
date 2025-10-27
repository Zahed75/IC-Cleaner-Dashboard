import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    PasswordModule,
    RippleModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {
  newPassword: string = '';
  repeatPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate API call to reset password
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Password reset successfully! Redirecting to login...';
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 2000);
  }

  private validateForm(): boolean {
    if (!this.newPassword || !this.repeatPassword) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (this.newPassword !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    // Check for password strength (optional)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(this.newPassword)) {
      this.errorMessage = 'Password should include uppercase, lowercase, number, and special character';
      return false;
    }

    return true;
  }
}