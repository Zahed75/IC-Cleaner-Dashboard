import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';


import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Bookings } from '@/components/admin/bookings/bookings';
import { Services } from '@/components/admin/services/services';
import { Cleaners } from '@/components/admin/cleaners/cleaners';
import { Clients } from '@/components/admin/clients/clients';
import { Payouts } from '@/components/admin/payouts/payouts';
import { Disputes } from '@/components/admin/disputes/disputes';
import { Reports } from '@/components/admin/reports/reports';
import { Settings } from '@/components/admin/settings/settings';
import { Dashboard } from '@/components/admin/dashboard/dashboard';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboard', component: Dashboard },
            { path: 'bookings', component: Bookings },
            { path: 'services', component: Services },
            { path: 'cleaners', component: Cleaners },
            { path: 'clients', component: Clients },
            { path: 'payouts', component: Payouts },
            { path: 'disputes', component: Disputes },
            { path: 'reports', component: Reports },
            { path: 'settings', component: Settings },

            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
