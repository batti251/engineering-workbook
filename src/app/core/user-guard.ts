import { CanActivateFn } from '@angular/router';
import { Auth } from './auth';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth)
  return auth.isValidUser();
};
