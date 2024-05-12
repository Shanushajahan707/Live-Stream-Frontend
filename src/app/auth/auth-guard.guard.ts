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

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

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
    } else {
      return true;
    }
  } catch (error) {
    localStorage.removeItem('token');
    router.navigateByUrl('');
    console.log(error);
    return false;
  }
};

export const authGuardForLoggedUsers: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp > currentTime) {
      if (decodedToken.role == 'user') {
        router.navigateByUrl('/userhome');
        return false;
      } else if (decodedToken.role == 'Admin') {
        router.navigateByUrl('/admin');
        return false;
      }
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return true;
  }
};

export const channelGuard: CanActivateFn = (route, state) => {
  const snackBar = inject(MatSnackBar);
  const toaster = inject(ToastrService);

  const channelDataString = localStorage.getItem('channeldata');
  console.log('channel data is',channelDataString);
  if (!channelDataString) {
    return true;
  }

  const channelData = JSON.parse(channelDataString);

  if (channelData.isBlocked) {
    toaster.error('Channel is blocked');

    snackBar.open('Channel is blocked by admin', 'Close', {
      duration: 5000,
    });
    return false;
  }

  return true;
};
