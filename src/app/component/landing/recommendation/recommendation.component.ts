import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../../../service/user/channel/channel.service';
import {  GetTrendingChannelResponse } from '../../../model/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss',
})
export class RecommendationComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  showMenu: boolean = false;
  _recommendations!: GetTrendingChannelResponse[];

  constructor(private _channelService: ChannelService) {}
  ngOnInit(): void {
    this._channelService
      .onGetTopChannelList()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._recommendations = res.channel;
            console.log(res);
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            console.log(err.error.message);
          }
        },
      });
      
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
