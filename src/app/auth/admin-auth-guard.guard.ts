import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminAuthGuardGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('admindata');
  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp > currentTime) {
      if (decodedToken.role == 'Admin') {
        return true;
      } else {
        router.navigateByUrl('/login');
        return false;
      }
    } else {
      localStorage.removeItem('admindata');
      router.navigateByUrl('/login');
      return false;
    }
  } catch (error) {
    localStorage.removeItem('admindata');
    router.navigateByUrl('/login');
    return false;
  }
};
