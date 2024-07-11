import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../../../service/user/channel/channel.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelData, User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LiveService } from '../../../service/user/live/live.service';

@Component({
  selector: 'app-recommendlist',
  templateUrl: './recommendlist.component.html',
  styleUrl: './recommendlist.component.scss',
})
export class RecommendlistComponent implements OnInit, OnDestroy {
  constructor(
    private _toaster: ToastrService,
    private _liveService: LiveService,
    private _channelService: ChannelService
  ) {}

  private readonly _destroy$ = new Subject<void>();
  _recommendedChannels: ChannelData[] = [];
  _recommendedLives: ChannelData[] = [];
  _responsiveOptions: any[] | undefined;
  userid!: string;
  decodedToken!: any;
  _followedChannels: string[]=[''];

  ngOnInit(): void {
    this.userid = localStorage.getItem('token') as string;
    this.decodedToken = jwtDecode(this.userid);
    this._channelService
      .onRecommededChannel()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            // this._toaster.success(res.message);
            // console.log('rec', res);
          }
          this._recommendedChannels = res.recommendedChannels;
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
    this._liveService
      .onGetRecommendedLive()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            // this._toaster.success(res.message);
          }
          // console.log('rec', res.recommendedChannels);
          this._recommendedLives = res.recommendedLives;
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
    this._channelService
      .onGetFollowChannelForHome()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && res.message) {
            // this._toaster.success(res.message);
          }
          this._followedChannels=res.channel
          console.log('rec 2', res.channel);
          console.log(this._followedChannels);
          console.log(this._followedChannels);
        },
        error: (err) => {
          if (err && err.error.message) {
            // this._toaster.error(err.error.message);
          }
        },
      });

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
  }

  follow(channel: ChannelData) {
    this._channelService
      .onFollowChannel(channel)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            console.log(res.channel);
            this._toaster.success(res.message);
            this._recommendedChannels = this._recommendedChannels.map((c) =>
              c._id === channel._id ? res.channel : c
            );
            this._followedChannels.push(channel._id)
            console.log(this.decodedToken._id);
            console.log(
              channel.followers.includes(this.decodedToken._id),
              ' respnse'
            );
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  unFollow(channel: ChannelData) {
    this._channelService
      .onUnFollowChannel(channel)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            console.log(res.channel);
            this._toaster.success(res.message);
            this._recommendedChannels = this._recommendedChannels.map((c) =>
              c._id === channel._id ? res.channel : c
            );
            this._followedChannels=this._followedChannels.filter(id=>id!==channel._id)
            console.log(this.decodedToken._id);
            console.log(
              channel.followers.includes(this.decodedToken._id),
              ' respnse'
            );
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }
  isFollowing(channel: ChannelData): boolean {
    const isfollow = channel.followers.includes(this.decodedToken._id);
    return isfollow;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
