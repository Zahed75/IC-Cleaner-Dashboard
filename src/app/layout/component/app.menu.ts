import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../../app/services/auth/auth-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <div class="menu-container">
      <ul class="layout-menu">
        <ng-container *ngFor="let item of menuModel; let i = index">
          <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
          <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
      </ul>
      
      <!-- Logout Section -->
      <div class="logout-section">
        <ul class="layout-menu">
          <li class="logout-menu-item">
            <a class="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
               (click)="logout()">
              <i class="pi pi-sign-out mr-2"></i>
              <span class="font-medium">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }
    
    .layout-menu {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .logout-section {
      border-top: 1px solid #e5e7eb;
    }
    
    .logout-menu-item a:hover {
      color: #ef4444 !important;
      background-color: #fef2f2 !important;
    }
    
    .menu-separator {
      border-top: 1px solid #e5e7eb;
      margin: 0.5rem 0;
    }
  `]
})
export class AppMenu implements OnInit {
  menuModel: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.buildMenu();
  }

  buildMenu(): void {
    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case 'admin':
        this.menuModel = this.getAdminMenu();
        break;
      case 'cleaner':
        this.menuModel = this.getCleanerMenu();
        break;
      case 'customer':
        this.menuModel = this.getCustomerMenu();
        break;
      default:
        this.menuModel = [];
    }
  }

  getAdminMenu(): MenuItem[] {
    return [
      {
        label: 'MAIN',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
          { label: 'Bookings', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/booking'] },
          { label: 'Services', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/services'] },
          { label: 'Cleaners', icon: 'pi pi-fw pi-users', routerLink: ['/admin/cleaners'] },
          { label: 'Clients', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/clients'] },
          { label: 'Payouts', icon: 'pi pi-fw pi-wallet', routerLink: ['/admin/payouts'] },
          { label: 'Disputes', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/admin/disputes'] },
          { label: 'Reports', icon: 'pi pi-fw pi-chart-line', routerLink: ['/admin/reports'] },
          // { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/settings'] }
        ]
      }
    ];
  }

  getCleanerMenu(): MenuItem[] {
    return [
      {
        label: 'MAIN',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/cleaner/dashboard'] },
          { label: 'Bookings', icon: 'pi pi-fw pi-calendar', routerLink: ['/cleaner/booking'] },
          { label: 'Payouts', icon: 'pi pi-fw pi-wallet', routerLink: ['/cleaner/payouts'] },
          { label: 'Disputes', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/cleaner/disputes'] },
          { label: 'Reports', icon: 'pi pi-fw pi-chart-line', routerLink: ['/cleaner/reports'] },
          { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/cleaner/settings'] }
        ]
      }
    ];
  }

  getCustomerMenu(): MenuItem[] {
    return [
      {
        label: 'MAIN',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/customer/dashboard'] },
          { label: 'Bookings', icon: 'pi pi-fw pi-calendar', routerLink: ['/customer/booking'] },
          { label: 'Billing', icon: 'pi pi-fw pi-credit-card', routerLink: ['/customer/billing'] },
          { label: 'Account Settings', icon: 'pi pi-fw pi-user-edit', routerLink: ['/customer/account-settings'] }
        ]
      }
    ];
  }

  logout() {
    this.authService.logout();
  }
}