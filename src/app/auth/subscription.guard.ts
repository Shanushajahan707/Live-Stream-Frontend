import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SubscriptionService } from '../service/user/subscription/subscription.service';
import { ToastrService } from 'ngx-toastr';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const service = inject(SubscriptionService);
  const router = inject(Router);
  const toaster=inject(ToastrService)

  return service.isTrailOver().pipe(
    map((res) => {
      if (res && res.isTrailOver) {
        return true;
      } else {
        toaster.error('Trail is not over')
        router.navigateByUrl('userhome');
        return false;
      }
    }),
    catchError(() => {
      router.navigateByUrl('userhome');
      return of(false);
    })
  );
};
