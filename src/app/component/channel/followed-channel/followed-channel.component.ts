import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelData } from '../../../model/auth';
import { ChannelService } from '../../../service/user/channel.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-followed-channel',
  templateUrl: './followed-channel.component.html',
  styleUrl: './followed-channel.component.scss',
})
export class FollowedChannelComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _responsiveOptions: any[] | undefined;
  _followedChannels: ChannelData[] = [];
  constructor(
    private _channelService: ChannelService,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this._responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this._channelService
      .onGetFullFollowedchannels()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this._followedChannels = res.follwedChannels;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            // this._toaster.error(err.error.message);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
