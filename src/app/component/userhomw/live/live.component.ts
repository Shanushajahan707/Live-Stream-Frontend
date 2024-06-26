import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';
import { DataPassingService } from '../../../service/user/data-passing.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChannelData } from '../../../model/auth';
import { LiveService } from '../../../service/user/live.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../../service/user/socket.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit, OnDestroy {
  @ViewChild('remoteVideo') _remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') _localVideo!: ElementRef<HTMLVideoElement>;
  private _isScreenSharing: boolean = false;
  private readonly _destroy$ = new Subject<void>();
  _isMicOn = true;
  _isVideoOn = true;
  _livereceivedData!: { Livename: string; RoomId: number };
  _joinreceivedData!: { RoomId: number };
  _isViewing = false;
  _joinlive = false;
  _startlive = false;
  messages: { username: string; message: string; timestamp: Date }[] = [];
  newMessage: string = '';
  channelData!: ChannelData;
  colors: string[] = [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
  ];
  constructor(
    private _socketService: SocketService,
    private _router: Router,
    private _dataService: DataPassingService,
    private _liveServive: LiveService,
    private _toaster: ToastrService
  ) {}

  ngOnInit() {
    this._liveServive
      .onGetChannel()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this.channelData = res.channeldata;
            console.log(this.channelData);

            this._dataService.currentData
              .pipe(takeUntil(this._destroy$))
              .subscribe((data) => {
                this._startlive = true;
                this._livereceivedData = data;
                if (data.RoomId > 0) {
                  console.log('start live ', data);
                  this.initializeConnection(this._livereceivedData.RoomId);
                }
              });

            this._dataService.joinroom
              .pipe(takeUntil(this._destroy$))
              .subscribe((data) => {
                this._joinlive = true;
                console.log('join live ', data);
                this._joinreceivedData = data;
                if (data.RoomId > 0) {
                  console.log('join live', this._joinreceivedData);
                  this.joinLiveStream(this._joinreceivedData.RoomId);
                }
              });

            this._socketService.remoteStream$
              .pipe(takeUntil(this._destroy$))
              .subscribe((remoteStream) => {
                const remoteVideoElement = this._remoteVideo.nativeElement;
                remoteVideoElement.srcObject = remoteStream;
              });

            this._socketService.chatMessages$
              .pipe(takeUntil(this._destroy$))
              .subscribe((message) => {
                this.messages.push(message);
              });
          }
        },
        error: (err) => {
          if (err && err.error) {
            console.log('error', err.error);
          }
        },
      });
  }

  initializeConnection(RoomId: number) {
    const currentDate = new Date();
    console.log('date', this.channelData.lastDateOfLive);
    const lastDateOfLive = new Date(this.channelData.lastDateOfLive);
    console.log('currentData ', currentDate);
    console.log('last date ', lastDateOfLive);
    localStorage.setItem('payment-required', this.channelData._id);
    if (lastDateOfLive > currentDate) {
      this._liveServive
        .onUpdateStartLiveInfo(RoomId)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res) {
              console.log('Response', res);
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              console.log('eror', err.error.message);
              this._toaster.error(err.error.message);
            }
          },
        });

      this._socketService.joinRoom(RoomId, 'broadcaster');
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const localVideoElement = this._localVideo.nativeElement;
          localVideoElement.srcObject = stream;
          this._socketService.handleAddTrack(stream);
        })
        .catch((error) => {
          console.error('Error accessing local media devices', error);
        });
    } else {
      this._toaster.error('Your trial is over');
      this._router.navigate(['/subscriptionplan']);
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this._socketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  joinLiveStream(RoomId: number) {
    if (this._joinreceivedData.RoomId) {
      this._isViewing = true;
      this._socketService.joinRoom(RoomId, 'viewer');
    }
  }

  toggleScreenShare() {
    if (this._isScreenSharing) {
      this.endScreenShare();
    } else {
      this.startScreenShare();
    }
    this._isScreenSharing = !this._isScreenSharing;
  }

  startScreenShare() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((screenStream) => {
        const screenTrack = screenStream.getTracks()[0];
        screenTrack.onended = () => this.endScreenShare();

        const localStream = this._localVideo.nativeElement
          .srcObject as MediaStream;
        const videoTrack = localStream.getVideoTracks()[0];
        // this._socketService.handleReplaceTrack(videoTrack, screenTrack);

        this._remoteVideo.nativeElement.srcObject = screenStream;
        console.log('Screen sharing started', screenStream);
      })
      .catch((error) => console.error('Error while sharing the screen', error));
  }

  endScreenShare() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        const videoTrack = localStream.getVideoTracks()[0];
        const currentStream = this._localVideo.nativeElement
          .srcObject as MediaStream;
        const screenTrack = currentStream.getVideoTracks()[0];

        // this._socketService.handleReplaceTrack(screenTrack, videoTrack);
        this._localVideo.nativeElement.srcObject = localStream;
        console.log('Screen sharing ended');
      })
      .catch((error) =>
        console.error('Error while switching back to webcam', error)
      );
  }

  toggleMic() {
    this._isMicOn = !this._isMicOn;
    const localStream = this._localVideo.nativeElement.srcObject as MediaStream;
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = this._isMicOn;
  }

  toggleVideo() {
    this._isVideoOn = !this._isVideoOn;
    const localStream = this._localVideo.nativeElement.srcObject as MediaStream;
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = this._isVideoOn;
  }

  leaveRoom() {
    this._socketService.disconnect();
    this._liveServive
      .onUpdateStopLiveInfo()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Response', res);
          }
          this._toaster.info('Live Ended');
          this._router.navigate(['']);
        },
        error: (err) => {
          if (err && err.error.message) {
            console.log('eror', err.error.message);
            this._toaster.error(err.error.message);
          }
        },
      });
  }
  getColor(index: number) {
    return this.colors[index % this.colors.length];
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
