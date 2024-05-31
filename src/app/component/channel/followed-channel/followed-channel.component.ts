import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelData } from '../../../model/auth';
import { ChannelService } from '../../../service/channel.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-followed-channel',
  templateUrl: './followed-channel.component.html',
  styleUrl: './followed-channel.component.scss',
})
export class FollowedChannelComponent implements OnInit, OnDestroy {
  private _onGetFullFollowedchannelsSubscription!: Subscription;
  responsiveOptions: any[] | undefined;
  followedChannels: ChannelData[] = [];
  constructor(
    private _channelService: ChannelService,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.responsiveOptions = [
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

    this._onGetFullFollowedchannelsSubscription = this._channelService
      .onGetFullFollowedchannels()
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this.followedChannels = res.follwedChannels;
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
    this._onGetFullFollowedchannelsSubscription?.unsubscribe();
  }
}
