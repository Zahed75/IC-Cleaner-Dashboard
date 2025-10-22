import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/sign-in']);
      return false;
    }

    // Check if route has role restriction
    const requiredRole = route.data['requiredRole'];
    const userRole = this.authService.getUserRole();

    console.log('AuthGuard - Required Role:', requiredRole, 'User Role:', userRole);

    if (requiredRole && userRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      this.redirectToRoleDashboard(userRole);
      return false;
    }

    // If userRole is null but we have a required role, redirect to sign-in
    if (requiredRole && !userRole) {
      this.router.navigate(['/sign-in']);
      return false;
    }

    return true;
  }

  private redirectToRoleDashboard(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'cleaner':
        this.router.navigate(['/cleaner/dashboard']);
        break;
      case 'customer':
        this.router.navigate(['/customer/dashboard']);
        break;
      default:
        this.router.navigate(['/sign-in']);
    }
  }
}