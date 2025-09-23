

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Main',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
          { label: 'Bookings',  icon: 'pi pi-fw pi-calendar', routerLink: ['/booking'] },
          { label: 'Services',  icon: 'pi pi-fw pi-cog', routerLink: ['/services'] },
          { label: 'Cleaners',  icon: 'pi pi-fw pi-users', routerLink: ['/cleaners'] },
          { label: 'Clients',   icon: 'pi pi-fw pi-id-card', routerLink: ['/clients'] },
          { label: 'Payouts',   icon: 'pi pi-fw pi-wallet', routerLink: ['/payouts'] },
          { label: 'Disputes',  icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/disputes'] },
          { label: 'Reports',   icon: 'pi pi-fw pi-chart-line', routerLink: ['/reports'] },
          { label: 'Settings',  icon: 'pi pi-fw pi-cog', routerLink: ['/settings'] }
        ]
      }
    ];
  }
}
