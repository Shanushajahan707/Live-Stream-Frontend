import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../service/user/subscription/subscription.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ChannelSubscriptionData } from '../../../model/auth';
@Component({
  selector: 'app-viewsubscriptionplan',
  templateUrl: './viewsubscriptionplan.component.html',
  styleUrl: './viewsubscriptionplan.component.scss',
})
export class ViewsubscriptionplanComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  channelPlans: ChannelSubscriptionData[] = [];
  constructor(
    private _channelSubscription: SubscriptionService,
    private _toaster: ToastrService
  ) {}
  ngOnInit(): void {
    this._channelSubscription
      .onGetChannelSubscription()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this.channelPlans = res.channelPlans;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  generateColor(index: number): string {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }
}
