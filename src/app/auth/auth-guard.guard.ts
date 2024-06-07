import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../service/account.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  let _service = inject(AccountService);

  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    _service.islogged$.next(false);
    router.navigateByUrl('');
    return false;
  }

  try {
    // Decode token
    const decodedToken: any = jwtDecode(token);

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      console.log('here the expire');
      localStorage.removeItem('token');
      _service.islogged$.next(false);
      router.navigateByUrl('');
      return false;
    } else {
      if (decodedToken.role == 'user') {
        await _service.userIsBlocked().subscribe({
          next: (res) => {
            console.log('response in the guard', res);
            if (res) {
              if (res.isBlocked == true) {
                _service.islogged$.next(false);
                console.log('usr blocked', res);
                router.navigateByUrl('/blocked-account');
                return false;
              } else {
                return true;
              }
            } else {
              _service.islogged$.next(false);
              return false;
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              _service.islogged$.next(false);
              console.log('error', err);
              router.navigateByUrl('');
            }
          },
        });
      }
    }
    return true;
  } catch (error) {
    console.log('Error decoding token:', error);
    router.navigateByUrl('');
    _service.islogged$.next(false);
    return false;
  }
};

// export const newauthGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   let _service = inject(AccountService);

//   const token = localStorage.getItem('token');
//   if (!token) {
//     _service.islogged$.next(false);
//     router.navigateByUrl('');
//     return false;
//   }

//   try {
//     // Decode token
//     const decodedToken: any = jwtDecode(token);

//     // Check if token has expired
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (decodedToken.exp < currentTime) {
//       console.log('here the expire');
//       localStorage.removeItem('token');
//       _service.islogged$.next(false);
//       router.navigateByUrl('');
//       return false;
//     } else {
//       if (decodedToken.role == 'user') {
//          _service.userIsBlocked().subscribe({
//           next: (res) => {
//             console.log('response in the guard', res);
//             if (res) {
//               if (res.isBlocked == true) {
//                 _service.islogged$.next(false);
//                 console.log('usr blocked', res);
//                 router.navigateByUrl('/blocked-account');
//                 return false;
//               } else {
//                 return true;
//               }
//             } else {
//               _service.islogged$.next(false);
//               return false;
//             }
//           },
//           error: (err) => {
//             if (err && err.error.message) {
//               _service.islogged$.next(false);
//               console.log('error', err);
//               router.navigateByUrl('');
//             }
//           },
//         });
//       } else {
//         router.navigateByUrl('');
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     console.log('Error decoding token:', error);
//     router.navigateByUrl('');
//     _service.islogged$.next(false);
//     return false;
//   }
// };

export const authGuardForLoggedUsers: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    // console.log('decoded',decodedToken);
    if (decodedToken.exp > currentTime) {
      if (decodedToken.role == 'user') {
        // console.log('enter the if');
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
