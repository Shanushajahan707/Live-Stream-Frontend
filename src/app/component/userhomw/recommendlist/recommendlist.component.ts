import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../../../service/channel.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelData, User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recommendlist',
  templateUrl: './recommendlist.component.html',
  styleUrl: './recommendlist.component.scss',
})
export class RecommendlistComponent implements OnInit, OnDestroy {
  constructor(
    private _service: ChannelService,
    private _toaster: ToastrService
  ) {}

  private readonly _destroy$ = new Subject<void>();
  _recommendedChannels: ChannelData[] = [];
  _responsiveOptions: any[] | undefined;

  ngOnInit(): void {
    this._service
      .onRecommededChannel()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
          }
          // console.log('rec', res.recommendedChannels);
          this._recommendedChannels = res.recommendedChannels;
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
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

  pictures = [
    {
      imageUrl:
        'https://www.shutterstock.com/shutterstock/photos/2154493101/display_1500/stock-photo-young-handsome-vlogger-pro-gamer-waving-hand-to-camera-says-hello-to-his-subscribers-and-followers-2154493101.jpg',
    },
    {
      imageUrl:
        'https://www.shutterstock.com/shutterstock/photos/2193104729/display_1500/stock-photo-excited-female-streamer-playing-a-video-game-online-stylish-woman-streaming-gameplay-from-her-home-2193104729.jpg',
    },
    {
      imageUrl:
        'https://www.shutterstock.com/shutterstock/photos/1900460083/display_1500/stock-photo-streamer-young-man-rejoices-in-victory-professional-gamer-playing-online-games-computer-with-1900460083.jpg',
    },
  ];
  follow(channel: ChannelData) {
    this._service
      .onFollowChannel(channel)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this._recommendedChannels = this._recommendedChannels.map((c) =>
              c._id === channel._id ? res.channel : c
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
    this._service
      .onUnFollowChannel(channel)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this._recommendedChannels = this._recommendedChannels.map((c) =>
              c._id === channel._id ? res.channel : c
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
    const userid: string = localStorage.getItem('token') as string;
    const decodedToken: any = jwtDecode(userid);
    const isfollow = channel.followers.includes(decodedToken._id);
    return isfollow;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
