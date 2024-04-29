// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { Observable } from 'rxjs';

// @Injectable({
//  providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//  constructor(private router: Router,private toaster:ToastrService) {}

//  canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     const userData = localStorage.getItem('token');
//     if (userData) {
//       return true;
//     } else {
//       this.toaster.error("Unauthorized Entry")
//       this.router.navigate(['/login']);
//       return false;
//     }
//  }
// }

import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigateByUrl('');
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      router.navigateByUrl('');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    router.navigateByUrl('');
    return false;
  }
};