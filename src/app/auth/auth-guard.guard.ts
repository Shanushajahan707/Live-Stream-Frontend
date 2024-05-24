import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../service/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _service =inject(AccountService)

  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    router.navigateByUrl('');
    return false;
  }

  try {
    // Decode token
    const decodedToken: any = jwtDecode(token);

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      _service.islogged$.next(false)
      router.navigateByUrl('');
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log('Error decoding token:', error);
    router.navigateByUrl('');
    return false;
  }
}
 

export const authGuardForLoggedUsers: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('decoded',decodedToken);
    if (decodedToken.exp > currentTime) {
      if (decodedToken.role == 'user') {
        console.log('enter the if');
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
