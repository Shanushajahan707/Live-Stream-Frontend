import { Component } from '@angular/core';
import { ChannelData } from '../../../model/auth';
import { ChannelmanageService } from '../../../service/channelmanage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-channelmanage',
  templateUrl: './admin-channelmanage.component.html',
  styleUrl: './admin-channelmanage.component.scss',
})
export class AdminChannelmanageComponent {
  channels: ChannelData[] = [];

  constructor(
    private _channelService: ChannelmanageService,
    private _toaster: ToastrService,
    private _service:ChannelmanageService
  ) {}

  ngOnInit(): void {
    this._channelService.getChannels().subscribe({
      next: (res) => {
        console.log('channels', res);
        if (res && res.message) console.log(res.channels);
        this.channels = res.channels;
        this._toaster.success(res.message);
      },
      error: (err) => {
        if (err && err.error.message) {
          this._toaster.error(err.error.message);
        }
      },
    });
  }
  toggleBlockStatus(channel:ChannelData){
    console.log("the toggleled channels is",channel);
    this._service.blockChannel(channel._id).subscribe({
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
}
