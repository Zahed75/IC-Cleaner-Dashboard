// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth-service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   canActivate(): boolean {
//     if (this.authService.isAuthenticated()) {
//       return true;
//     } else {
//       this.router.navigate(['/sign-in']);
//       return false;
//     }
//   }
// }




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
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole();

    if (requiredRole && userRole !== requiredRole) {
      // Redirect to dashboard if user doesn't have required role
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}