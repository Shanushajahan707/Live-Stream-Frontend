import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelData, Follower, User } from '../../../model/auth';
import { ChannelmanageService } from '../../../service/channelmanage.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-admin-channelmanage',
  templateUrl: './admin-channelmanage.component.html',
  styleUrl: './admin-channelmanage.component.scss',
})
export class AdminChannelmanageComponent implements OnInit, OnDestroy {
  private _getChannelSubscription!: Subscription;
  private _blockChannelSubscription!: Subscription;
  private _getUserDataSubsciption!: Subscription;

  channels: ChannelData[] = [];
  currentPage = 1;
  itemsPerPage = 1;
  totalPages = 0;
  followers: Follower[] = [];
  isVisible = false;
  user!: User;
  isUserDataVisible: boolean = false;
  constructor(
    private _channelService: ChannelmanageService,
    private _toaster: ToastrService,
    private _service: ChannelmanageService
  ) {}

  ngOnInit(): void {
    this.getChannels();
  }

  getChannels() {
    this._getChannelSubscription = this._channelService
      .getChannels(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (res) => {
          console.log('channels', res);
          if (res && res.message) console.log(res.channels);

          this.channels = res.channels;
          console.log('all channels', this.channels);
          this.totalPages = Math.ceil(res.totalcount / this.itemsPerPage);
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
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getChannels();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getChannels();
    }
  }

  toggleBlockStatus(channel: ChannelData) {
    console.log('the toggleled channels is', channel);
    this._blockChannelSubscription = this._service
      .blockChannel(channel._id)
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
    this.followers = channel.followers;
    console.log('followers', this.followers);
    this.showModal();
  }
  showModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.isUserDataVisible = false;
  }
  showUserDetails(userId: string) {
    this.isUserDataVisible = true;
    this._getUserDataSubsciption = this._channelService
      .getUserData(userId)
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this.user = res.userData;
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
    this._getUserDataSubsciption?.unsubscribe();
    this._getChannelSubscription?.unsubscribe();
    this._blockChannelSubscription?.unsubscribe();
  }
}
