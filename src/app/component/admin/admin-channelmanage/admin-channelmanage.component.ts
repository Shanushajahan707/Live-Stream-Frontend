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
  currentPage = 1;
  itemsPerPage = 1;
  totalPages = 0;
  constructor(
    private _channelService: ChannelmanageService,
    private _toaster: ToastrService,
    private _service:ChannelmanageService
  ) {}

  ngOnInit(): void {
    this.getChannels()
  }
  
  
  getChannels(){
    this._channelService.getChannels(this.currentPage,this.itemsPerPage).subscribe({
      next: (res) => {
        console.log('channels', res);
        if (res && res.message) console.log(res.channels);

        this.channels = res.channels;
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
