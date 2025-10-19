import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from '../src/app/components/admin/auth/login/login'; // Import Login component

import { Cleaners } from '@/components/admin/cleaners/cleaners';
import { Clients } from '@/components/admin/clients/clients';
import { Payouts } from '@/components/admin/payouts/payouts';
import { Disputes } from '@/components/admin/disputes/disputes';
import { Reports } from '@/components/admin/reports/reports';
import { Settings } from '@/components/admin/settings/settings';
import { Dashboard } from '@/components/admin/dashboard/dashboard';
import { BookingsComponent } from '@/components/admin/bookings/bookings';
import { ServicesComponent } from '@/components/admin/services/services';
import { AuthGuard } from '../src/app/guard/auth-guard'; // We'll create this guard

export const appRoutes: Routes = [
    // Login route (default)
    { path: '', component: Login },
    { path: 'sign-in', component: Login },
    
    // Protected routes (with layout)
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard], // Protect all admin routes
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'booking', component: BookingsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'cleaners', component: Cleaners },
            { path: 'clients', component: Clients },
            { path: 'payouts', component: Payouts },
            { path: 'disputes', component: Disputes },
            { path: 'reports', component: Reports },
            { path: 'settings', component: Settings },
            
            // Redirect to dashboard when base admin route is accessed
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    
    // Redirect any unknown routes to login
    { path: '**', redirectTo: '' }
];