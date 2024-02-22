import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoutesConstants } from '../constants/routes.constants';

export const authGuard: CanMatchFn = async (route, segments) => {
  const _router = inject(Router);
  const _authService = inject(AuthService);
  const isAuthenticated = await _authService.checkUserAuth();

  if(!isAuthenticated) _router.navigate([RoutesConstants.LOGIN]);
  return true;
};