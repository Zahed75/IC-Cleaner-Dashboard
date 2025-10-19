// src/app/app.config.ts
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

// ✅ add this import
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// (Alternatively use: import { provideAnimations } from '@angular/platform-browser/animations';)

import { appRoutes } from './app.routes';
import { MessageService } from 'primeng/api';

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
    
    // HTTP client with fetch
    provideHttpClient(withFetch()),

    // ✅ enable animations (pick ONE of async or sync)
    provideAnimationsAsync(),
    // provideAnimations(),

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