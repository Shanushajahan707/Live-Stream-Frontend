import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../../service/channel.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelData, User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-recommendlist',
  templateUrl: './recommendlist.component.html',
  styleUrl: './recommendlist.component.scss',
})
export class RecommendlistComponent implements OnInit {
  constructor(
    private _service: ChannelService,
    private _toaster: ToastrService
  ) {}
  recommendedChannels: ChannelData[] = [];

  ngOnInit(): void {
    this._service.onRecommededChannel().subscribe({
      next: (res) => {
        if (res && res.message) {
          this._toaster.success(res.message);
        }
        console.log('rec', res.recommendedChannels);
        this.recommendedChannels = res.recommendedChannels;
      },
      error: (err) => {
        if (err && err.error.message) {
          this._toaster.error(err.error.message);
        }
      },
    });
    
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
    this._service.onFollowChannel(channel).subscribe({
      next: (res) => {
        if (res && res.message) {
          this._toaster.success(res.message);
          this.recommendedChannels = this.recommendedChannels.map((c) =>
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
    this._service.onUnFollowChannel(channel).subscribe({
      next: (res) => {
        if (res && res.message) {
          this._toaster.success(res.message);
          this.recommendedChannels = this.recommendedChannels.map((c) =>
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
    console.log('flow', isfollow);
    return isfollow;
  }
}
