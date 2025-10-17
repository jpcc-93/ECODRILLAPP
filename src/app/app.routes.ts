// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importamos los componentes que acabamos de crear
import { Scanner } from './components/scanner/scanner';
import { Admin } from './components/admin/admin';
import { Reports } from './components/reports/reports';

export const routes: Routes = [
  // Si el usuario va a la URL principal, lo redirigimos al scanner
  { path: '', redirectTo: '/scanner', pathMatch: 'full' },

  // Cuando el usuario vaya a la URL /scanner, se mostrará el ScannerComponent
  { path: 'scanner', component: Scanner },

  // Cuando vaya a /admin, se mostrará el AdminComponent
  { path: 'admin', component: Admin },

  // Y cuando vaya a /reports, se mostrará el ReportsComponent
  { path: 'reports', component: Reports },
];