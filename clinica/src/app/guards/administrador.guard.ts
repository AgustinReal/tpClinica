import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(FirebaseService).esAdmin && inject(FirebaseService).estaLogueado;
};
