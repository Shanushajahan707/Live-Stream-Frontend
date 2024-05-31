import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SocketService } from '../../../service/socket.service';
import { Router } from '@angular/router';
import { DataPassingService } from '../../../service/data-passing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'], // Note: styleUrl is deprecated in favor of styleUrls
})
export class LiveComponent implements OnInit, OnDestroy {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  private _currentDataSubscription!: Subscription;
  private _remoteStreamSubscription!: Subscription;
  private peer!: RTCPeerConnection;
  private isScreenSharing: boolean = false;
  isMicOn = true;
  isVideoOn = true;
  receivedData: { Livename: string; RoomId: number } = {
    Livename: '',
    RoomId: 0,
  };
  constructor(
    private _socketService: SocketService,
    private _router: Router,
    private _dataService: DataPassingService
  ) {
    this.peer = new RTCPeerConnection();
  }

  ngOnInit() {
    this._currentDataSubscription = this._dataService.currentData.subscribe(
      (data) => (this.receivedData = data)
    );
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const localVideoElement = document.getElementById(
          'localVideo'
        ) as HTMLVideoElement;
        if (localVideoElement instanceof HTMLVideoElement) {
          localVideoElement.srcObject = stream;
          console.log('Local stream assigned', stream);
          this._socketService.handleAddTrack(stream);
        } else {
          console.log('Local video element not found');
        }
      })
      .catch((error) => {
        console.log('Error accessing local media devices', error);
        throw error;
      });
    this._socketService.joinRoom(
      this.receivedData.RoomId,
      this.receivedData.Livename
    );

    this._remoteStreamSubscription = this._socketService.remoteStream$
      .pipe()
      .subscribe((remoteStream) => {
        console.log('remote stream is', remoteStream);
        const remoteVideoElement = document.getElementById(
          'remoteVideo'
        ) as HTMLVideoElement;
        if (remoteVideoElement instanceof HTMLVideoElement) {
          console.log('Remote video stream received');
          remoteVideoElement.srcObject = remoteStream;
        } else {
          console.log('Remote video element not found');
        }
      });
    document
      .getElementById('screenShare')
      ?.addEventListener('click', () => this.startScreenShare());
  }

  toggleScreenShare() {
    if (this.isScreenSharing) {
      this.endScreenShare();
    } else {
      this.startScreenShare();
    }
    this.isScreenSharing = !this.isScreenSharing;
  }

  startScreenShare() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((screenStream) => {
        const screenTrack = screenStream.getTracks()[0];
        screenTrack.onended = () => {
          this.endScreenShare();
        };

        const localStream = this.localVideo.nativeElement
          .srcObject as MediaStream;
        const videoTrack = localStream.getVideoTracks()[0];
        this._socketService.replaceTrack(videoTrack, screenTrack);

        const screenVideoElement = document.getElementById(
          'screenVideo'
        ) as HTMLVideoElement;
        screenVideoElement.style.display = 'block';
        if (screenVideoElement) {
          screenVideoElement.srcObject = screenStream;
        }

        console.log('Screen sharing started', screenStream);
      })
      .catch((error) => console.log('Error while sharing the screen', error));
  }

  endScreenShare() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        const videoTrack = localStream.getVideoTracks()[0];
        const currentStream = this.remoteVideo.nativeElement
          .srcObject as MediaStream;
        const screenTrack = currentStream.getVideoTracks()[0];
        console.log('currentStream', currentStream);
        this._socketService.replaceTrack(screenTrack, videoTrack);

        console.log('Screen sharing stopped, local video restored');
      })
      .catch((error) =>
        console.log('Error restoring local video stream', error)
      );
  }
  toggleMic() {
    console.log('toggle mic');
    this.isMicOn = !this.isMicOn;
    const localStream = this.localVideo.nativeElement.srcObject as MediaStream;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  }

  toggleVideo() {
    console.log('toggle video');
    this.isVideoOn = !this.isVideoOn;
    const localStream = this.localVideo.nativeElement.srcObject as MediaStream;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = this.isVideoOn;
    });
  }

  endCall() {
    console.log('End call');
    const localVideo = this.localVideo.nativeElement.srcObject as MediaStream;
    const remoteVideo = this.remoteVideo.nativeElement.srcObject as MediaStream;
    this.stopMediaStream(localVideo);
    this.stopMediaStream(remoteVideo);
    this._socketService.disconnect();
    this._router.navigateByUrl('');
  }

  stopMediaStream(stream: MediaStream | undefined) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  ngOnDestroy(): void {
    this._currentDataSubscription?.unsubscribe();
    this._remoteStreamSubscription?.unsubscribe();
  }
}
