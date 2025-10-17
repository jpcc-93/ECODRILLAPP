// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// IMPORTACIONES DE FIREBASE (El nuevo método)
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // CONFIGURACIÓN DE FIREBASE
    // Proveedores modulares de @angular/fire — no envolver con importProvidersFrom
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};