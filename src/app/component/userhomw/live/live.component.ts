// import {
//   Component,
//   ElementRef,
//   OnDestroy,
//   OnInit,
//   ViewChild,
// } from '@angular/core';

// import { Router } from '@angular/router';
// import { DataPassingService } from '../../../service/user/data/data-passing.service';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import {
//   ChannelData,
//   ChannelSubscriptionUsers,
//   Message,
//   User,
// } from '../../../model/auth';
// import { LiveService } from '../../../service/user/live/live.service';
// import { ToastrService } from 'ngx-toastr';
// import { SocketService } from '../../../service/user/socket/socket.service';
// import { SubscriptionService } from '../../../service/user/subscription/subscription.service';
// import { jwtDecode } from 'jwt-decode';

// @Component({
//   selector: 'app-live',
//   templateUrl: './live.component.html',
//   styleUrls: ['./live.component.scss'],
// })
// export class LiveComponent implements OnInit, OnDestroy {
//   @ViewChild('remoteVideo') _remoteVideo!: ElementRef<HTMLVideoElement>;
//   @ViewChild('localVideo') _localVideo!: ElementRef<HTMLVideoElement>;
//   private _isScreenSharing: boolean = false;
//   private readonly _destroy$ = new Subject<void>();
//   _isMicOn = true;
//   _isVideoOn = true;
//   _livereceivedData!: { Livename: string; RoomId: number };
//   _joinreceivedData!: { RoomId: number };
//   _isViewing = false;
//   _joinlive = false;
//   _startlive = false;
//   messages: Message[] = [];
//   newMessage: string = '';
//   streamingId!: string;
//   channelData!: ChannelData;
//   subscribers: ChannelSubscriptionUsers[] = [];
//   decodetoken!: User;
//   mediaRecorder: any;
//   audioChunks: any[] = [];
//   audioBlob: Blob | null = null;
//   audioUrl: string | null = null;
//   isRecording: boolean = false;
//   showEmojiPicker: boolean = false;
//   colors: string[] = [
//     'text-red-500',
//     'text-blue-500',
//     'text-green-500',
//     'text-yellow-500',
//     'text-purple-500',
//   ];
//   constructor(
//     private _socketService: SocketService,
//     private _router: Router,
//     private _dataService: DataPassingService,
//     private _liveServive: LiveService,
//     private _toaster: ToastrService,
//     private _subscriptionService: SubscriptionService
//   ) {}

//   ngOnInit() {
//     this._liveServive
//       .onGetChannel()
//       .pipe(takeUntil(this._destroy$))
//       .subscribe({
//         next: (res) => {
//           if (res && res.message) {
//             this.channelData = res.channeldata;
//             console.log(this.channelData);

//             this._dataService.currentData
//               .pipe(takeUntil(this._destroy$))
//               .subscribe((data) => {
//                 this._livereceivedData = data;
//                 if (data.RoomId > 0) {
//                   // console.log('start live ', data);
//                   localStorage.setItem(
//                     'roomId',
//                     this._livereceivedData.RoomId.toString()
//                   );
//                   console.log('start live', this._livereceivedData);

//                   this._startlive = true;
//                   this.initializeConnection(this._livereceivedData.RoomId);
//                 } else {
//                   // console.log('else called');
//                   const roomId = localStorage.getItem('roomId') as string;
//                   // console.log("rooomid",roomId);
//                   if (roomId) {
//                     this._startlive = true;
//                     this.initializeConnection(parseInt(roomId));
//                   }
//                 }
//               });

//             this._dataService.joinroom
//               .pipe(takeUntil(this._destroy$))
//               .subscribe((data) => {
//                 // console.log('join live ', data);
//                 this._joinreceivedData = data;
//                 if (data.RoomId > 0) {
//                   localStorage.setItem(
//                     'joinRoom',
//                     this._joinreceivedData.RoomId.toString()
//                   );
//                   this._joinlive = true;
//                   console.log('join live', this._joinreceivedData);
//                   this.joinLiveStream(this._joinreceivedData.RoomId);
//                 } else {
//                   const roomId = localStorage.getItem('joinRoom') as string;
//                   console.log(roomId);
//                   if (roomId) {
//                     this._joinlive = true;
//                     this.joinLiveStream(parseInt(roomId));
//                   }
//                 }
//               });

//             this._socketService.remoteStream$
//               .pipe(takeUntil(this._destroy$))
//               .subscribe((remoteStream) => {
//                 const remoteVideoElement = this._remoteVideo.nativeElement;
//                 remoteVideoElement.srcObject = remoteStream;
//               });

//             this._socketService.chatMessages$
//               .pipe(takeUntil(this._destroy$))
//               .subscribe((message) => {
//                 this.messages.push(message);
//               });
//           }
//         },
//         error: (err) => {
//           if (err && err.error) {
//             console.log('error', err.error);
//           }
//         },
//       });
//   }

//   initializeConnection(RoomId: number) {
//     const currentDate = new Date();
//     // console.log('date', this.channelData.lastDateOfLive);
//     const lastDateOfLive = new Date(this.channelData.lastDateOfLive);
//     // console.log('currentData ', currentDate);
//     // console.log('last date ', lastDateOfLive);
//     localStorage.setItem('payment-required', this.channelData._id);
//     if (lastDateOfLive > currentDate) {
//       this._liveServive
//         .onUpdateStartLiveInfo(RoomId)
//         .pipe(takeUntil(this._destroy$))
//         .subscribe({
//           next: (res) => {
//             if (res) {
//               console.log('Response', res);
//             }
//           },
//           error: (err) => {
//             if (err && err.error.message) {
//               console.log('eror', err.error.message);
//               this._toaster.error(err.error.message);
//             }
//           },
//         });

//       this._liveServive
//         .getAllSubscribedMember()
//         .pipe(takeUntil(this._destroy$))
//         .subscribe({
//           next: (res) => {
//             if (res) {
//               this.subscribers = res.members;
//               console.log(this.subscribers);
//             }
//           },
//           error: (err) => {
//             if (err && err.error.message) {
//               console.log('eror', err.error.message);
//               this._toaster.error(err.error.message);
//             }
//           },
//         });

//       this._liveServive
//         .updateLiveHistoryInfo(
//           this._livereceivedData.Livename,
//           this._livereceivedData.RoomId
//         )
//         .pipe(takeUntil(this._destroy$))
//         .subscribe({
//           next: (res) => {
//             if (res) {
//               console.log(res);
//               this.streamingId = res.liveId;
//               // console.log('streaming id is', this.streamingId);
//             }
//           },
//           error: (err) => {
//             if (err && err.error.message) {
//               console.log('eror', err.error.message);
//               this._toaster.error(err.error.message);
//             }
//           },
//         });

//       this._socketService.joinRoom(RoomId, 'broadcaster');
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           const localVideoElement = this._localVideo.nativeElement
//           localVideoElement.srcObject = stream;
//           this._socketService.handleAddTrack(stream);
//         })
//         .catch((error) => {
//           console.error('Error accessing local media devices', error);
//         });
//     } else {
//       this._toaster.error('Your trial is over');
//       this._router.navigate(['/subscriptionplan']);
//     }

//     // console.log('is create ', this._startlive);
//   }

//   getSubscriberPlan(username: string): number | null {
//     const subscriber = this.subscribers.find(
//       (subscriber) => subscriber.members.userId === username
//     );
//     return subscriber ? parseInt(subscriber.members.channelPlanId) : null;
//   }

//   sendMessage(message: string, messageType: 'text' | 'audio') {
//     this._socketService.sendMessage(message, messageType);
//     this.newMessage = '';
//   }
//   toggleEmojiPicker() {
//     this.showEmojiPicker = !this.showEmojiPicker;
//   }

//   addEmoji(event: any) {
//     this.newMessage += event.emoji.native;
//   }

//   startRecording() {
//     this.isRecording = true;
//     console.log('recording started');
    
//     this._toaster.info('recording started');
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         this.mediaRecorder = new MediaRecorder(stream);
//         this.mediaRecorder.start();
//         this.mediaRecorder.ondataavailable = (e: any) => {
//           this.audioChunks.push(e.data);
//         };
//       })
//       .catch((err) => console.error('Error accessing media devices.', err));
//   }

//   stopRecording() {
//     this.isRecording = false;
//     console.log('recording stopped');
//     this._toaster.info('recording stopped');

//     this.mediaRecorder.stop();
//     this.mediaRecorder.onstop = () => {
//       this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64AudioMessage = reader.result as string;
//         this._socketService.sendMessage(base64AudioMessage, 'audio');
//         this.audioChunks = []; // Clear the audio chunks for the next recording
//       };

//       reader.readAsDataURL(this.audioBlob); // Convert the Blob to a base64 string
//     };
//   }

//   joinLiveStream(RoomId: number) {
//     if (this._joinreceivedData.RoomId) {
//       this._isViewing = true;
//       const token = localStorage.getItem('token');
//       if (token) {
//         this.decodetoken = jwtDecode(token);
//       }
//       this._liveServive
//         .updateLiveHistoryUserInfo(RoomId, this.decodetoken._id)
//         .pipe(takeUntil(this._destroy$))
//         .subscribe({
//           next: (res) => {
//             if (res) {
//               console.log(res);
//               this.streamingId = res.liveId;
//               console.log('streaming id is', this.streamingId);
//             }
//           },
//           error: (err) => {
//             if (err && err.error.message) {
//               console.log('eror', err.error.message);
//               this._toaster.error(err.error.message);
//             }
//           },
//         });

//       this._socketService.joinRoom(RoomId, 'viewer');
//     }

//     console.log('is join ', this._joinlive);
//   }

//   toggleScreenShare() {
//     if (this._isScreenSharing) {
//       this.endScreenShare();
//     } else {
//       this.startScreenShare();
//     }
//     this._isScreenSharing = !this._isScreenSharing;
//   }

//   startScreenShare() {
//     navigator.mediaDevices
//       .getDisplayMedia({ video: true })
//       .then((screenStream) => {
//         const screenTrack = screenStream.getTracks()[0];
//         screenTrack.onended = () => this.endScreenShare();

//         const localStream = this._localVideo.nativeElement.srcObject as MediaStream;
//         this._socketService.handleAddTrack(screenStream);

//         const combinedStream = new MediaStream([...localStream.getTracks(), screenTrack]);
//         this._remoteVideo.nativeElement.srcObject = combinedStream;
//         this._socketService.setRemoteStream(screenStream); // Set remote stream to screen share
//         console.log('Screen sharing started', screenStream);
//       })
//       .catch((error) => console.error('Error while sharing the screen', error));
//   }

//   endScreenShare() {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((localStream) => {
//         this._socketService.handleAddTrack(localStream);
//         this._localVideo.nativeElement.srcObject = localStream;
//         this._socketService.setRemoteStream(localStream); // Set remote stream back to camera
//         console.log('Screen sharing ended');
//       })
//       .catch((error) => console.error('Error while switching back to webcam', error));
//   }

//   toggleMic() {
//     this._isMicOn = !this._isMicOn;
//     const localStream = this._localVideo.nativeElement.srcObject as MediaStream;
//     const audioTrack = localStream.getAudioTracks()[0];
//     audioTrack.enabled = this._isMicOn;
//   }

//   toggleVideo() {
//     this._isVideoOn = !this._isVideoOn;
//     const localStream = this._localVideo.nativeElement.srcObject as MediaStream;
//     const videoTrack = localStream.getVideoTracks()[0];
//     videoTrack.enabled = this._isVideoOn;
//   }

//   leaveRoom() {
//     this._socketService.disconnect();

//     this._liveServive
//       .onUpdateStopLiveInfo()
//       .pipe(takeUntil(this._destroy$))
//       .subscribe({
//         next: (res) => {
//           if (res) {
//             console.log('Response', res);
//           }
//           this._toaster.info('Live Ended');
//           this._router.navigate(['']);
//         },
//         error: (err) => {
//           if (err && err.error.message) {
//             console.log('eror', err.error.message);
//             this._toaster.error(err.error.message);
//           }
//         },
//       });

//     this._liveServive
//       .updateLiveHistoryEndInfo(this._livereceivedData.RoomId)
//       .pipe(takeUntil(this._destroy$))
//       .subscribe({
//         next: (res) => {
//           if (res) {
//             console.log(res);
//             this.streamingId = res.liveId;
//             this._toaster.info('live history updated');
//             console.log('streaming id is', this.streamingId);
//           }
//         },
//         error: (err) => {
//           if (err && err.error.message) {
//             console.log('eror', err.error.message);
//             this._toaster.error(err.error.message);
//           }
//         },
//       });

//     localStorage.removeItem('roomId');
//     localStorage.removeItem('joinRoom');

//     if (this._localVideo.nativeElement) {
//       const localVideoElement = this._localVideo.nativeElement;
//       const localStream = localVideoElement.srcObject as MediaStream;
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//   }
//   getColor(index: number) {
//     return this.colors[index % this.colors.length];
//   }

//   ngOnDestroy() {
//     this._destroy$.next();
//     this._destroy$.complete();
//   }
// }

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataPassingService } from '../../../service/user/data/data-passing.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ChannelData,
  ChannelSubscriptionUsers,
  Message,
  User,
} from '../../../model/auth';
import { LiveService } from '../../../service/user/live/live.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../../service/user/socket/socket.service';
import { SubscriptionService } from '../../../service/user/subscription/subscription.service';
import { HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

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
  messages: Message[] = [];
  newMessage: string = '';
  streamingId!: string;
  channelData!: ChannelData;
  subscribers: ChannelSubscriptionUsers[] = [];
  decodetoken!: User;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: any[] = [];
  audioBlob: Blob | null = null;
  isRecording: boolean = false;
  showEmojiPicker: boolean = false;
  viewerCount: number = 0;
  colors: string[] = [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
  ];
  private stream: MediaStream | null = null;

  constructor(
    private _socketService: SocketService,
    private _router: Router,
    private _dataService: DataPassingService,
    private _liveServive: LiveService,
    private _toaster: ToastrService,
    private _subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this._liveServive
      .onGetChannel()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.channeldata) {
            this.channelData = res.channeldata;

            this._dataService.currentData
              .pipe(takeUntil(this._destroy$))
              .subscribe((data) => {
                this._livereceivedData = data;
                if (data.RoomId > 0) {
                  localStorage.setItem(
                    'roomId',
                    this._livereceivedData.RoomId.toString()
                  );
                  console.log('start live', this._livereceivedData);
                  this._startlive = true;
                  this.initializeConnection(this._livereceivedData.RoomId);
                } else {
                  const roomId = localStorage.getItem('roomId');
                  if (roomId) {
                    this._startlive = true;
                    this.initializeConnection(parseInt(roomId));
                  }
                }
              });

            this._dataService.joinroom
              .pipe(takeUntil(this._destroy$))
              .subscribe((data) => {
                this._joinreceivedData = data;
                if (data.RoomId > 0) {
                  localStorage.setItem(
                    'joinRoom',
                    this._joinreceivedData.RoomId.toString()
                  );
                  this._joinlive = true;
                  console.log('join live', this._joinreceivedData);
                  this.joinLiveStream(this._joinreceivedData.RoomId);
                } else {
                  const roomId = localStorage.getItem('joinRoom');
                  if (roomId) {
                    this._joinlive = true;
                    this.joinLiveStream(parseInt(roomId));
                  }
                }
              });

            this._socketService.remoteStream$
              .pipe(takeUntil(this._destroy$))
              .subscribe((remoteStream) => {
                if (remoteStream && this._joinlive) {
                  console.log('Viewer received stream, tracks:', remoteStream.getTracks());
                  this._remoteVideo.nativeElement.srcObject = null; // Reset to avoid stale streams
                  this._remoteVideo.nativeElement.srcObject = remoteStream;
                  this._remoteVideo.nativeElement
                    .play()
                    .catch((err: Error) => {
                      console.error('Video play error:', err);
                      this._toaster.error('Failed to play video stream');
                    });
                } else {
                  console.warn('No remote stream or not in viewer mode');
                }
              });

             this._socketService.chatMessages$
              .pipe(takeUntil(this._destroy$))
              .subscribe((message) => {
                this.messages.push(message);
              });
            this._socketService.viewerCount$
              .pipe(takeUntil(this._destroy$))
              .subscribe((count) => {
                console.log('Viewer count updated:', count);
                this.viewerCount = count;
              });

            this._socketService.error$
              .pipe(takeUntil(this._destroy$))
              .subscribe((error) => {
                console.error('Socket error:', error);
                this._toaster.error(error);
              });
          }
        },
        error: (err: HttpErrorResponse) => {
          this._toaster.error(
            err.error?.message || 'Failed to fetch channel data'
          );
        },
      });
  }

  initializeConnection(RoomId: number) {
    const currentDate = new Date();
    const lastDateOfLive = new Date(this.channelData.lastDateOfLive);
    localStorage.setItem('payment-required', this.channelData._id);
    if (lastDateOfLive > currentDate) {
      this._liveServive.onUpdateStartLiveInfo(RoomId).subscribe({
        next: (res) => console.log('Update live info:', res),
        error: (err: HttpErrorResponse) =>
          this._toaster.error(
            err.error?.message || 'Failed to update live info'
          ),
      });

      this._liveServive.getAllSubscribedMember().subscribe({
        next: (res) => (this.subscribers = res.members),
        error: (err: HttpErrorResponse) =>
          this._toaster.error(
            err.error?.message || 'Failed to fetch subscribers'
          ),
      });

      this._liveServive
        .updateLiveHistoryInfo(this._livereceivedData.Livename, RoomId)
        .subscribe({
          next: (res) => (this.streamingId = res.liveId),
          error: (err: HttpErrorResponse) =>
            this._toaster.error(
              err.error?.message || 'Failed to update live history'
            ),
        });

      this._socketService.joinRoom(RoomId, 'broadcaster');
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.stream = stream;
          console.log('Broadcaster stream tracks:', stream.getTracks());
          this._localVideo.nativeElement.srcObject = stream;
          this._socketService.handleAddTrack(stream);
        })
        .catch((error: Error) => {
          console.error('Error accessing media devices:', error);
          this._toaster.error('Failed to access camera or microphone');
        });
    } else {
      this._toaster.error('Your trial is over');
      this._router.navigate(['/subscriptionplan']);
    }
  }

  joinLiveStream(RoomId: number) {
    if (this._joinreceivedData.RoomId) {
      this._isViewing = true;
      const token = localStorage.getItem('token');
      if (token) {
        this.decodetoken = jwtDecode(token);
      }
      this._liveServive
        .updateLiveHistoryUserInfo(RoomId, this.decodetoken._id)
        .subscribe({
          next: (res) => (this.streamingId = res.liveId),
          error: (err: HttpErrorResponse) =>
            this._toaster.error(
              err.error?.message || 'Failed to update live history'
            ),
        });
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
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrack.onended = () => this.endScreenShare();
        if (this.stream && this.stream.getVideoTracks().length > 0) {
          const oldTrack = this.stream.getVideoTracks()[0];
          this._socketService.handleReplaceTrack(oldTrack, screenTrack);
          this.stream.removeTrack(oldTrack);
          this.stream.addTrack(screenTrack);
        } else {
          this.stream = new MediaStream([screenTrack]);
          if (this.stream.getAudioTracks().length > 0) {
            this.stream.addTrack(this.stream.getAudioTracks()[0]);
          }
          this._socketService.handleAddTrack(this.stream);
        }
        this._localVideo.nativeElement.srcObject = this.stream;
      })
      .catch((error: Error) => {
        console.error('Error while sharing screen:', error);
        this._toaster.error('Failed to start screen sharing');
      });
  }

  endScreenShare() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((cameraStream) => {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (this.stream && this.stream.getVideoTracks().length > 0) {
          const oldTrack = this.stream.getVideoTracks()[0];
          this._socketService.handleReplaceTrack(oldTrack, videoTrack);
          this.stream.removeTrack(oldTrack);
          this.stream.addTrack(videoTrack);
        } else {
          this.stream = new MediaStream([videoTrack]);
          if (this.stream.getAudioTracks().length > 0) {
            this.stream.addTrack(this.stream.getAudioTracks()[0]);
          }
          this._socketService.handleAddTrack(this.stream);
        }
        this._localVideo.nativeElement.srcObject = this.stream;
      })
      .catch((error: Error) => {
        console.error('Error while switching back to webcam:', error);
        this._toaster.error('Failed to switch back to camera');
      });
  }

  toggleMic() {
    if (this.stream) {
      this._isMicOn = !this._isMicOn;
      this.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = this._isMicOn));
    }
  }

  toggleVideo() {
    if (this.stream) {
      this._isVideoOn = !this._isVideoOn;
      this.stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = this._isVideoOn));
    }
  }

  startRecording() {
    this.isRecording = true;
    this._toaster.info('Recording started');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });
        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (e: any) =>
          this.audioChunks.push(e.data);
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onload = () => {
            const base64AudioMessage = reader.result as string;
            let username: string = localStorage.getItem('userName') || 'Anonymous';
            this._socketService.sendMessage(username,base64AudioMessage, 'audio');
            this.audioChunks = [];
          };
          reader.readAsDataURL(this.audioBlob);
        };
      })
      .catch((err: Error) => {
        console.error('Error accessing audio device:', err);
        this._toaster.error('Failed to start recording');
        this.isRecording = false;
      });
  }

  stopRecording() {
    this.isRecording = false;
    this._toaster.info('Recording stopped');
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

 sendMessage(message: string, messageType: 'text' | 'audio') {
    let username: string = localStorage.getItem('userName') || 'Anonymous';
    this._socketService.sendMessage(username,message, messageType);
    this.newMessage = '';
  }


  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.newMessage += event.emoji.native;
  }

  getSubscriberPlan(username: string): number | null {
    const subscriber = this.subscribers.find(
      (s) => s.members.userId === username
    );
    return subscriber ? parseInt(subscriber.members.channelPlanId) : null;
  }

  leaveRoom() {
    this._socketService.disconnect();
    this._liveServive.onUpdateStopLiveInfo().subscribe({
      next: () => {
        this._toaster.info('Live Ended');
        this._router.navigate(['']);
      },
      error: (err: HttpErrorResponse) =>
        this._toaster.error(err.error?.message || 'Error ending live stream'),
    });

    this._liveServive
      .updateLiveHistoryEndInfo(this._livereceivedData.RoomId)
      .subscribe({
        next: (res) => {
          this.streamingId = res.liveId;
          this._toaster.info('Live history updated');
        },
        error: (err: HttpErrorResponse) =>
          this._toaster.error(
            err.error?.message || 'Error updating live history'
          ),
      });

    localStorage.removeItem('roomId');
    localStorage.removeItem('joinRoom');

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  getColor(index: number) {
    return this.colors[index % this.colors.length];
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._socketService.disconnect();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}