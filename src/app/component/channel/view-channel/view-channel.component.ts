import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelData } from '../../../model/auth';
import { ChannelService } from '../../../service/channel.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-channel',
  templateUrl: './view-channel.component.html',
  styleUrl: './view-channel.component.scss',
})
export class ViewChannelComponent implements OnInit, OnDestroy {
  private _onGetFollowChannelSubscription!: Subscription;
  channelId!: string;
  selectedContent!: string;
  followChannel!: ChannelData;
  responsiveOptions: any[] | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _channelService: ChannelService,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      this.channelId = params.get('id') as string;
      console.log('channel id: ', this.channelId);
      this._onGetFollowChannelSubscription = this._channelService
        .onGetFollowChannel(this.channelId)
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
              this.followChannel = res.channel;
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    });
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
  }

  ngOnDestroy(): void {
    this._onGetFollowChannelSubscription?.unsubscribe();
  }
}
