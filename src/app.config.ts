// src/app/app.config.ts
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

// ✅ add this import
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { appRoutes } from './app.routes';
import { MessageService } from 'primeng/api';
import { authInterceptor } from '../src/app/interceptor/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular core providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router configuration
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ 
        anchorScrolling: 'enabled', 
        scrollPositionRestoration: 'enabled' 
      }),
      withEnabledBlockingInitialNavigation()
    ),
    
    // HTTP client with fetch and interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),

    // ✅ enable animations
    provideAnimationsAsync(),

    // PrimeNG configuration
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark'
        }
      }
    }),

    // PrimeNG services
    MessageService
  ]
};