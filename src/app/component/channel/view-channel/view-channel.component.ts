import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelData } from '../../../model/auth';
import { ChannelService } from '../../../service/channel.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-channel',
  templateUrl: './view-channel.component.html',
  styleUrl: './view-channel.component.scss',
})
export class ViewChannelComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _channelId!: string;
  _selectedContent: string = 'shorts';
  _followChannel!: ChannelData;
  _responsiveOptions: any[] | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _channelService: ChannelService,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      this._channelId = params.get('id') as string;
      console.log('channel id: ', this._channelId);
      this._channelService
        .onGetFollowChannel(this._channelId)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
              this._followChannel = res.channel;
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
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

  onVideoPlay(videoItem: any) {
    console.log('played' + videoItem);
    const formdata = new FormData();
    formdata.append('videourl', videoItem);
    this._channelService
      .onUpdateViews(formdata, this._followChannel._id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._followChannel.video.forEach((video) => {
              const updatedVideo = res.channel.video.find(
                (v) => v.url === video.url
              );
              if (updatedVideo) {
                video.views = updatedVideo.views;
              }
            });
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
}
