// role-component.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../app/services/auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleComponentResolver implements Resolve<any> {
  
  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const userRole = this.authService.getUserRole();
    
    // Define component mapping based on role and route
    const componentMap: any = {
      dashboard: {
        'admin': () => import('@/components/admin/dashboard/dashboard').then(m => m.Dashboard),
        'cleaner': () => import('@/components/cleaner-app/dashboard/dashboard').then(m => m.CleanerDashboardComponent),
        'customer': () => import('@/components/customer-app/dashboard/dashboard').then(m => m.CustomerDashboardComponent)
      },
      booking: {
        'admin': () => import('@/components/admin/bookings/bookings').then(m => m.BookingsComponent),
        'cleaner': () => import('@/components/cleaner-app/bookings/bookings').then(m => m.CleanerBookingsComponent),
        'customer': () => import('@/components/customer-app/bookings/bookings').then(m => m.CustomerBookingsComponent)
      },
      // Add other routes as needed
    };

    const routeName = route.routeConfig?.path;
    // Safely get loaders for the resolved route and pick role-specific loader if available
    const loadersForRoute = routeName ? componentMap[routeName] : undefined;
    let componentLoader: (() => Promise<any>) | null = null;

    if (loadersForRoute) {
      if (typeof userRole === 'string' && loadersForRoute[userRole]) {
        componentLoader = loadersForRoute[userRole];
      } else {
        componentLoader = loadersForRoute['admin'] || null;
      }
    }
    
    return componentLoader ? componentLoader() : null;
  }
}