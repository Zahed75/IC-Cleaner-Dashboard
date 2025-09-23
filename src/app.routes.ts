import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';



import { Cleaners } from '@/components/admin/cleaners/cleaners';
import { Clients } from '@/components/admin/clients/clients';
import { Payouts } from '@/components/admin/payouts/payouts';
import { Disputes } from '@/components/admin/disputes/disputes';
import { Reports } from '@/components/admin/reports/reports';
import { Settings } from '@/components/admin/settings/settings';
import { Dashboard } from '@/components/admin/dashboard/dashboard';
import { BookingsComponent } from '@/components/admin/bookings/bookings';
import { ServicesComponent } from '@/components/admin/services/services';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboard', component: Dashboard },
            { path:'booking',component:BookingsComponent},
            { path: 'services', component: ServicesComponent },
            { path: 'cleaners', component: Cleaners },
            { path: 'clients', component: Clients },
            { path: 'payouts', component: Payouts },
            { path: 'disputes', component: Disputes },
            { path: 'reports', component: Reports },
            { path: 'settings', component: Settings },


        ]
    },
   
    { path: '**', redirectTo: '/notfound' }
];
