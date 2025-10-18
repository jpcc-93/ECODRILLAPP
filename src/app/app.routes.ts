// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importamos los componentes que acabamos de crear
import { Login } from './auth/login/login';
import { Scanner } from './components/scanner/scanner';
import { Admin } from './components/admin/admin';
import { Reports } from './components/reports/reports';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
   // RUTAS PÚBLICAS
  { path: 'login', component: Login },
  { path: 'scanner', component: Scanner },

  // RUTAS PROTEGIDAS
  { 
    path: 'admin', 
    component: Admin, 
    canActivate: [authGuard], // Aplicamos el guardia
    data: { roles: ['admin'] } // Le decimos al guardia que solo el rol 'admin' puede entrar
  },
  { 
    path: 'reports', 
    component: Reports, 
    canActivate: [authGuard], // Aplicamos el guardia también aquí
    data: { roles: ['admin', 'aux'] } // 'admin' y 'aux' pueden ver los reportes
  },

  // Redirecciones
  { path: '', redirectTo: '/scanner', pathMatch: 'full' },
  { path: '**', redirectTo: '/scanner' } // Si no encuentra la ruta, va al scanner
];