import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SubscriptionService } from '../service/user/subscription/subscription.service';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const service = inject(SubscriptionService);
  const router = inject(Router);
  service.isTrailOver().subscribe({
    next: (res) => {
      if (res) {
        if (res.isTrailOver) {
          return true;
        } else {
          router.navigateByUrl('userhome');
          return false;
        }
      } else {
        router.navigateByUrl('userhome');
        return false;
      }
    },
  });
  router.navigateByUrl('userhome');
  return false;
};
