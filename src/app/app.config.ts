import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    mode: 'light',
                    darkModeSelector: '.my-app-light',
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng',
                        darkModeSelector: false 
                    }
                }
            }
        }),
        provideRouter(routes),
        importProvidersFrom(BrowserAnimationsModule),
        HttpClientModule,
        provideHttpClient(),
        ConfirmationService,
        MessageService
    ]
};
