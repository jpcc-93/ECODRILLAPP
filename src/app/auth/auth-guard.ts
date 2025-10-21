import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseService } from '../services/firebase';
import { switchMap, take } from 'rxjs/operators'; // OJO: cambiamos 'map' por 'switchMap'

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as Array<string>;

  return firebaseService.authState$().pipe(
    take(1),
    // Usamos switchMap para manejar la promesa interna
    switchMap(async user => {
      if (user) {
        const role = await firebaseService.getUserRole(user.uid);
        
        if (!allowedRoles || allowedRoles.length === 0) {
          return true; // Si la ruta no pide roles, con estar logueado basta
        }
        
        if (role && allowedRoles.includes(role)) {
          return true; // El usuario tiene el rol permitido
        }

        // Si el rol no es correcto, lo mandamos al scanner
        router.navigate(['/scanner']);
        return false;
      }

      // Si no hay usuario, lo mandamos al login
      router.navigate(['/login']);
      return false;
    })
  );
};