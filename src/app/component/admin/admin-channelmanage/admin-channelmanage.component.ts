import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelData, Follower, User } from '../../../model/auth';
import { ChannelmanageService } from '../../../service/channelmanage.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-admin-channelmanage',
  templateUrl: './admin-channelmanage.component.html',
  styleUrl: './admin-channelmanage.component.scss',
})
export class AdminChannelmanageComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _channels: ChannelData[] = [];
  _currentPage = 1;
  _itemsPerPage = 3;
  _totalPages = 0;
  _followers: Follower[] = [];
  _isVisible = false;
  _profileVisible = false;
  _user!: User;
  _isUserDataVisible: boolean = false;
  constructor(
    private _channelService: ChannelmanageService,
    private _toaster: ToastrService,
    private _service: ChannelmanageService
  ) {}

  ngOnInit(): void {
    this.getChannels();
  }

  getChannels() {
    this._channelService
      .getChannels(this._currentPage, this._itemsPerPage)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log('channels', res);
          if (res && res.message) console.log(res.channels);

          this._channels = res.channels;
          console.log('all channels', this._channels);
          this._totalPages = Math.ceil(res.totalcount / this._itemsPerPage);
          this._toaster.success(res.message);
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  nextPage() {
    if (this._currentPage < this._totalPages) {
      this._currentPage++;
      this.getChannels();
    }
  }

  prevPage() {
    if (this._currentPage > 1) {
      this._currentPage--;
      this.getChannels();
    }
  }

  toggleBlockStatus(channel: ChannelData) {
    console.log('the toggleled channels is', channel);
    this._service
      .blockChannel(channel._id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }
  viewFollowers(channel: ChannelData) {
    console.log('channel', channel);
    this._followers = channel.followers;
    console.log('followers', this._followers);
    this.showModal();
  }
  showModal() {
    this._isVisible = true;
  }

  closeModal() {
    this._isVisible = false;
    this._isUserDataVisible = false;
  }
  showUserDetails(userId: string) {
    this._isUserDataVisible = true;
    this._channelService
      .getUserData(userId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._user = res.userData;
            this._toaster.show(res.message);
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
