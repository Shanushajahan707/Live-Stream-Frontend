import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../../service/socket.service';
import { Router } from '@angular/router';
import { DataPassingService } from '../../../service/data-passing.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'], // Note: styleUrl is deprecated in favor of styleUrls
})
export class LiveComponent implements OnInit {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
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
  ) {}

  ngOnInit() {
    this._dataService.currentData.subscribe(
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

    this._socketService.remoteStream$.pipe().subscribe((remoteStream) => {
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
        const screenShare = screenStream.getTracks()[0];
        screenShare.onended = () => {
          this.endScreenShare();
        };
        const sender = this.peer
          .getSenders()
          .find((s) => s.track?.kind === screenShare.kind);
        if (sender) {
          sender.replaceTrack(screenShare);
        } else {
          this.peer.addTrack(screenShare, screenStream);
        }
        const localVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
        if (localVideoElement instanceof HTMLVideoElement) {
          localVideoElement.srcObject = screenStream;
        }
        console.log('streamscreen',screenStream);
      })
      .catch((error) => console.log('error while sharing', error));
  }

  endScreenShare() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = this.peer.getSenders().find((s) => {
          s.track?.kind === videoTrack.kind;
        });
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      })
      .catch((error) => console.log('error accessing the local media', error));
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
}
