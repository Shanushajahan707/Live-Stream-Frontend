import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuardGuard: CanActivateFn = (route, state) => {
 const adminData = localStorage.getItem('admindata');
 if (adminData) {
    return true;
 } else {
    const router = new Router();
    router.navigate(['/login']);
    return false;
 }
};
