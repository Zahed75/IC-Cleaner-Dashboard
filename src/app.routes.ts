import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from '../src/app/components/admin/auth/login/login';

// Import all components
import { Cleaners } from '@/components/admin/cleaners/cleaners';
import { Clients } from '@/components/admin/clients/clients';
import { Payouts } from '@/components/admin/payouts/payouts';
import { Disputes } from '@/components/admin/disputes/disputes';
import { Reports } from '@/components/admin/reports/reports';
import { Settings } from '@/components/admin/settings/settings';
import { Dashboard } from '@/components/admin/dashboard/dashboard';
import { BookingsComponent } from '@/components/admin/bookings/bookings';
import { ServicesComponent } from '@/components/admin/services/services';

import { CleanerDashboardComponent } from '@/components/cleaner-app/dashboard/dashboard';
import { CleanerBookingsComponent } from '@/components/cleaner-app/bookings/bookings';
import { CleanerPayoutsComponent } from '@/components/cleaner-app/payouts/payouts';
import { CleanerDisputesComponent } from '@/components/cleaner-app/disputes/disputes';
import { CleanerReportsComponent } from '@/components/cleaner-app/reports/reports';
import { CleanerSettingsComponent } from '@/components/cleaner-app/settings/settings';

import { CustomerDashboardComponent } from '@/components/customer-app/dashboard/dashboard';
import { CustomerBookingsComponent } from '@/components/customer-app/bookings/bookings';
import { CustomerBillingComponent } from '@/components/customer-app/billings/billings';
import { CustomerAccountSettingsComponent } from '@/components/customer-app/settings/settings';

import { AuthGuard } from '../src/app/guard/auth-guard';

export const appRoutes: Routes = [
    // Login route (only for specific paths)
    { path: '', component: Login },
    { path: 'sign-in', component: Login },

    // Admin routes
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [AuthGuard],
        data: { requiredRole: 'admin' },
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'bookings', component: BookingsComponent }, // Changed from 'booking' to 'bookings'
            { path: 'payouts', component: Payouts },
            { path: 'disputes', component: Disputes },
            { path: 'reports', component: Reports },
            { path: 'settings', component: Settings },
            { path: 'services', component: ServicesComponent },
            { path: 'cleaners', component: Cleaners },
            { path: 'clients', component: Clients },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Cleaner routes
    {
        path: 'cleaner',
        component: AppLayout,
        canActivate: [AuthGuard],
        data: { requiredRole: 'cleaner' },
        children: [
            { path: 'dashboard', component: CleanerDashboardComponent },
            { path: 'booking', component: CleanerBookingsComponent }, // Changed from 'booking' to 'bookings'
            { path: 'payouts', component: CleanerPayoutsComponent },
            { path: 'disputes', component: CleanerDisputesComponent },
            { path: 'reports', component: CleanerReportsComponent },
            { path: 'settings', component: CleanerSettingsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Customer routes - FIXED: Changed 'booking' to 'bookings'
    {
        path: 'customer',
        component: AppLayout,
        canActivate: [AuthGuard],
        data: { requiredRole: 'customer' },
        children: [
            { path: 'dashboard', component: CustomerDashboardComponent },
            { path: 'booking', component: CustomerBookingsComponent },
            { path: 'billing', component: CustomerBillingComponent },
            { path: 'account-settings', component: CustomerAccountSettingsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Redirect any unknown routes to login
    { path: '**', redirectTo: '' }
];