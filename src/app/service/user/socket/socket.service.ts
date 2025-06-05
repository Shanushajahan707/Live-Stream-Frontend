// import { Injectable } from '@angular/core';
// import { jwtDecode } from 'jwt-decode';
// import { Subject } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
// import { User } from '../../../model/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class SocketService {
//   private _socket: Socket;
//   private _remoteId!: string;
//   roomid!: number;
//   username!: string;
//   private remoteStreamSubject = new Subject<MediaStream>();
//   remoteStream$ = this.remoteStreamSubject.asObservable();

//   private chatMessagesSubject = new Subject<{
//     username: string;
//     message: string;
//     timestamp: Date;
//     type: 'text' | 'audio';
//     audioUrl?: string;
//   }>();
//   chatMessages$ = this.chatMessagesSubject.asObservable();

//   peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: ['stun:stun.l.google.com:19302'],
//       },
//     ],
//   });

//   constructor() {
//     this._socket = io('http://localhost:3000', {});
//     // this._socket = io('https://onlineecart.shop', {});
//     // this._socket = io('https://capturelive.onrender.com', {});
//     this._socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//     });

//     this._socket.on('connect', () => {
//       console.log('Successfully connected to socket server');
//     });

//     this.handleUserJoined();
//     this.handleOffer();
//     this.handleAnswer();
//     this.handleRemoteStream();
//     this.handleICECandidates();
//     this.peerNegotiationNeeded();
//     this.peerNegoIncoming();
//     this.peerNegoFinal();
//     this.handleChatMessages();
//   }

//   joinRoom(room: number, role: string) {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decodetoken: User = jwtDecode(token);
//       const data = { room, role, username: decodetoken.username };
//       this.roomid = data.room;
//       this.username = decodetoken.username;
//       console.log('join room', data);
//       this._socket.emit('join room', data);
//     }
//   }

//   sendMessage(message: string, messageType: 'text' | 'audio') {
//     const room = this.roomid;
//     this._socket.emit('chat message', {
//       room,
//       message,
//       username: this.username,
//       messageType,
//     });
//   }

//   handleChatMessages() {
//     this._socket.on('chat message', (data) => {
//       console.log('Chat data from the signaling server', data);
//       const { username, message, messageType, timestamp, audioUrl } = data;
//       this.chatMessagesSubject.next({
//         username,
//         message: messageType === 'audio' ? '' : message,
//         timestamp: new Date(timestamp),
//         type: messageType,
//         audioUrl: messageType === 'audio' ? audioUrl : undefined,
//       });
//     });
//   }

//   handleUserJoined() {
//     this._socket.on('user joined', (data) => {
//       console.log('user joined', data.role, data.id);
//       this._remoteId = data.id;
//       if (data.role === 'viewer') {
//         this.createOffer(data.id);
//       }
//     });

//     this._socket.on('viewer-joined', (viewerId) => {
//       console.log('Viewer joined', viewerId);
//       this.createOffer(viewerId);
//     });
//   }

//   createOffer(id: string) {
//     this.peer
//       .createOffer()
//       .then((offer) => {
//         return this.peer.setLocalDescription(offer).then(() => {
//           console.log('local description set', offer);
//           this._socket.emit('offer', { id, offer });
//         });
//       })
//       .catch((error) => console.error('createOffer error:', error));
//   }

//   handleOffer() {
//     this._socket.on('offer', async (data) => {
//       console.log('Offer received', data);
//       await this.peer.setRemoteDescription(data.offer);
//       this.peer
//         .createAnswer()
//         .then((answer) => {
//           this.peer.setLocalDescription(answer).then(() => {
//             this._socket.emit('answer', {
//               id: data.id,
//               answer,
//             });
//           });
//         })
//         .catch((error) => console.error('createAnswer error:', error));
//     });
//   }

//   handleAnswer() {
//     this._socket.on('answer', async (data) => {
//       console.log('Answer received', data);
//       await this.peer.setRemoteDescription(data.answer);
//     });
//   }

//   handleRemoteStream() {
//     this.peer.addEventListener('track', async (event) => {
//       const [remoteStream] = event.streams;
//       this.remoteStreamSubject.next(remoteStream);
//     });
//   }

//   handleAddTrack(stream: MediaStream) {
//     stream.getTracks().forEach((track) => {
//       this.peer.addTrack(track, stream);
//     });
//   }

//   setRemoteStream(stream: MediaStream) {
//     this.remoteStreamSubject.next(stream);
//   }

//   handleICECandidates() {
//     this.peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         this._socket.emit('ice-candidate', {
//           id: this._remoteId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     this._socket.on('ice-candidate', (data) => {
//       this.peer
//         .addIceCandidate(new RTCIceCandidate(data.candidate))
//         .catch((error) =>
//           console.error('Error adding received ice candidate', error)
//         );
//     });
//   }

//   peerNegotiationNeeded() {
//     this.peer.onnegotiationneeded = async () => {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(offer);
//       this._socket.emit('peer-nego-needed', {
//         id: this._remoteId,
//         offer: this.peer.localDescription,
//       });
//     };
//   }

//   peerNegoIncoming() {
//     this._socket.on('peer-nego-needed', async (data) => {
//       const { offer } = data;
//       await this.peer.setRemoteDescription(offer);
//       const answer = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(answer);
//       this._socket.emit('peer-nego-done', {
//         id: this._remoteId,
//         answer: this.peer.localDescription,
//       });
//     });
//   }

//   peerNegoFinal() {
//     this._socket.on('peer-nego-final', async (data) => {
//       const { answer } = data;
//       await this.peer.setRemoteDescription(answer);
//     });
//   }

//   handleReplaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack) {
//     oldTrack.stop();
//     newTrack.enabled = true;
//     this.peer.addTrack(newTrack);
//   }

//   disconnect() {
//     this._socket.disconnect();
//   }
// }

//

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
// import { Message } from '../../../model/auth';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private _socket: Socket;
//   private peerConnections: { [id: string]: RTCPeerConnection } = {};
//   private iceCandidateQueues: { [id: string]: RTCIceCandidateInit[] } = {};
//   private broadcasterStream: MediaStream | null = null;
//   private remoteStreamSubject = new Subject<MediaStream>();
//   private chatMessagesSubject = new BehaviorSubject<Message[]>([]);
//   private viewerCountSubject = new Subject<number>();
//   private errorSubject = new Subject<string>();
//   remoteStream$ = this.remoteStreamSubject.asObservable();
//   chatMessages$ = this.chatMessagesSubject.asObservable();
//   viewerCount$ = this.viewerCountSubject.asObservable();
//   error$ = this.errorSubject.asObservable();

//   constructor() {
//     this._socket = io('http://localhost:3000', {
//       transports: ['websocket'],
//       withCredentials: true
//     });

//     this.initializeSocketEvents();
//   }

//   private initializeSocketEvents() {
//     this._socket.on('connect', () => {
//       console.log('Connected to socket server:', this._socket.id);
//     });

//     this._socket.on('chat message', (message: Message) => {
//   console.log(`Received chat message:`, message);
//   const currentMessages = this.chatMessagesSubject.value;
//   this.chatMessagesSubject.next([...currentMessages, message]);
// });

//     this._socket.on('offer', async (data) => {
//       console.log(`Received offer from ${data.id}, SDP:`, data.offer.sdp);
//       const peerConnection = this.createPeerConnection(data.id);
//       try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         this._socket.emit('answer', { id: data.id, answer });
//         console.log(`Sent answer to ${data.id}, SDP:`, answer.sdp);
//         this.processQueuedIceCandidates(data.id);
//       } catch (err) {
//         console.error('Error handling offer:', err);
//         this.errorSubject.next('Failed to handle offer');
//       }
//     });

//     this._socket.on('answer', async (data) => {
//       console.log(`Received answer from ${data.id}, SDP:`, data.answer.sdp);
//       const peerConnection = this.peerConnections[data.id];
//       if (peerConnection) {
//         try {
//           await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
//           console.log(`Set remote description for ${data.id}`);
//           this.processQueuedIceCandidates(data.id);
//         } catch (err) {
//           console.error('Error handling answer:', err);
//           this.errorSubject.next('Failed to handle answer');
//         }
//       } else {
//         console.warn(`No peer connection for ${data.id}`);
//       }
//     });

//     this._socket.on('ice-candidate', async (data) => {
//       console.log(`Received ICE candidate from ${data.id}`);
//       const peerConnection = this.peerConnections[data.id];
//       if (peerConnection) {
//         if (peerConnection.remoteDescription) {
//           try {
//             await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//             console.log(`Added ICE candidate from ${data.id}`);
//           } catch (err) {
//             console.error('ICE candidate error:', err);
//             this.errorSubject.next('Failed to add ICE candidate');
//           }
//         } else {
//           console.log(`Queuing ICE candidate from ${data.id} (no remote description)`);
//           if (!this.iceCandidateQueues[data.id]) {
//             this.iceCandidateQueues[data.id] = [];
//           }
//           this.iceCandidateQueues[data.id].push(data.candidate);
//         }
//       } else {
//         console.warn(`No peer connection for ${data.id}`);
//       }
//     });

//     this._socket.on('viewer-joined', (viewerId) => {
//       console.log(`Viewer joined: ${viewerId}`);
//       const peerConnection = this.createPeerConnection(viewerId);
//       if (this.broadcasterStream) {
//         console.log(`Adding broadcaster stream tracks to ${viewerId}:`, this.broadcasterStream.getTracks());
//         this.broadcasterStream.getTracks().forEach(track => {
//           const alreadyAdded = peerConnection.getSenders().some(sender => sender.track === track);
//           if (!alreadyAdded) {
//             peerConnection.addTrack(track, this.broadcasterStream!);
//             console.log(`Added track ${track.kind} to peer connection for ${viewerId}`);
//           }
//         });
//       }
//       this.createOffer(viewerId);
//     });

//     this._socket.on('viewer count', (data) => {
//       console.log(`Viewer count: ${data.count}`);
//       this.viewerCountSubject.next(data.count);
//     });

//   //   sendMessage(message: string, messageType: 'text' | 'audio') {
// //     const room = this.roomid;
// //     this._socket.emit('chat message', {
// //       room,
// //       message,
// //       username: this.username,
// //       messageType,
// //     });
// //   }

// //   handleChatMessages() {
// //     this._socket.on('chat message', (data) => {
// //       console.log('Chat data from the signaling server', data);
// //       const { username, message, messageType, timestamp, audioUrl } = data;
// //       this.chatMessagesSubject.next({
// //         username,
// //         message: messageType === 'audio' ? '' : message,
// //         timestamp: new Date(timestamp),
// //         type: messageType,
// //         audioUrl: messageType === 'audio' ? audioUrl : undefined,
// //       });
// //     });
// //   }

//     this._socket.on('error', (data) => {
//       console.error(`Socket error: ${data.message}`);
//       this.errorSubject.next(data.message);
//     });

//     this._socket.on('broadcaster-left', () => {
//       console.log('Broadcaster left');
//       this.errorSubject.next('Broadcaster has left the room');
//     });
//   }

//   private createPeerConnection(peerId: string): RTCPeerConnection {
//     if (this.peerConnections[peerId]) {
//       console.log(`Reusing existing peer connection for ${peerId}`);
//       return this.peerConnections[peerId];
//     }

//     const peerConnection = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:stun1.l.google.com:19302' }
//       ]
//     });

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this._socket.emit('ice-candidate', { id: peerId, candidate: event.candidate });
//         console.log(`Sent ICE candidate to ${peerId}`);
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       console.log(`Received remote track from ${peerId}, streams:`, event.streams);
//       if (event.streams && event.streams[0]) {
//         const remoteStream = event.streams[0];
//         console.log(`Remote stream tracks:`, remoteStream.getTracks());
//         if (remoteStream.getTracks().length > 0) {
//           this.remoteStreamSubject.next(remoteStream);
//         } else {
//           console.warn(`Remote stream from ${peerId} has no tracks`);
//         }
//       } else {
//         console.warn(`No streams in ontrack event from ${peerId}`);
//       }
//     };

//     peerConnection.oniceconnectionstatechange = () => {
//       console.log(`ICE connection state for ${peerId}: ${peerConnection.iceConnectionState}`);
//       if (peerConnection.iceConnectionState === 'failed') {
//         peerConnection.restartIce();
//       }
//     };

//     this.peerConnections[peerId] = peerConnection;
//     return peerConnection;
//   }

//   private async createOffer(peerId: string) {
//     const peerConnection = this.peerConnections[peerId];
//     if (!peerConnection) {
//       console.warn(`No peer connection for ${peerId}`);
//       return;
//     }
//     try {
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);
//       this._socket.emit('offer', { id: peerId, offer });
//       console.log(`Sent offer to ${peerId}, SDP:`, offer.sdp);
//     } catch (err) {
//       console.error('Error creating offer:', err);
//       this.errorSubject.next('Failed to create offer');
//     }
//   }

//   private async processQueuedIceCandidates(peerId: string) {
//     const queue = this.iceCandidateQueues[peerId];
//     if (queue && queue.length > 0) {
//       console.log(`Processing ${queue.length} queued ICE candidates for ${peerId}`);
//       const peerConnection = this.peerConnections[peerId];
//       for (const candidate of queue) {
//         try {
//           await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//           console.log(`Added queued ICE candidate for ${peerId}`);
//         } catch (err) {
//           console.error('Error adding queued ICE candidate:', err);
//         }
//       }
//       this.iceCandidateQueues[peerId] = [];
//     }
//   }

//   joinRoom(roomId: number, role: 'broadcaster' | 'viewer') {
//     this._socket.emit('join room', {
//       room: roomId.toString(),
//       role,
//       username: 'user_' + this._socket.id
//     });
//     console.log(`Joined room ${roomId} as ${role}`);
//   }

//   handleAddTrack(stream: MediaStream) {
//     console.log(`Storing broadcaster stream tracks:`, stream.getTracks());
//     this.broadcasterStream = stream;
//     // Tracks are added in viewer-joined
//   }

//   handleReplaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack) {
//     console.log(`Replacing track ${oldTrack.kind} with ${newTrack.kind}`);
//     Object.values(this.peerConnections).forEach(peerConnection => {
//       const sender = peerConnection.getSenders().find(s => s.track === oldTrack);
//       if (sender) {
//         sender.replaceTrack(newTrack);
//         console.log(`Replaced track in peer connection`);
//         if (this.broadcasterStream) {
//           this.broadcasterStream.removeTrack(oldTrack);
//           this.broadcasterStream.addTrack(newTrack);
//           console.log(`Updated broadcaster stream tracks:`, this.broadcasterStream.getTracks());
//         }
//       } else {
//         console.warn(`No sender found for track ${oldTrack.kind}`);
//       }
//     });
//   }

// sendMessage(message: string, messageType: 'text' | 'audio') {
//   const roomId = localStorage.getItem('roomId') || localStorage.getItem('joinRoom');
//   if (roomId) {
//     const messageData = {
//       room: roomId,
//       message,
//       username: 'user_' + this._socket.id,
//       messageType
//     };
//     this._socket.emit('chat message', messageData);
//     console.log(`Sent ${messageType} message to room ${roomId}:`, messageData);
//   } else {
//     console.error('No roomId found in localStorage for sending message');
//     this.errorSubject.next('Failed to send message: No room ID');
//   }
// }

//   setRemoteStream(stream: MediaStream) {
//     console.log(`Manually setting remote stream:`, stream.getTracks());
//     this.remoteStreamSubject.next(stream);
//   }

//   disconnect() {
//     console.log('Disconnecting socket and closing peer connections');
//     this._socket.disconnect();
//     Object.values(this.peerConnections).forEach(pc => pc.close());
//     this.peerConnections = {};
//     this.iceCandidateQueues = {};
//     this.broadcasterStream = null;
//   }
// }

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _socket: Socket;
  private peerConnections: { [id: string]: RTCPeerConnection } = {};
  private iceCandidateQueues: { [id: string]: RTCIceCandidateInit[] } = {};
  private broadcasterStream: MediaStream | null = null;
  private remoteStreamSubject = new Subject<MediaStream>();
  private chatMessagesSubject = new Subject<{
    username: string;
    message: string;
    timestamp: Date;
    type: 'text' | 'audio';
    audioUrl?: string;
  }>();
  private viewerCountSubject = new Subject<number>();
  private errorSubject = new Subject<string>();
  remoteStream$ = this.remoteStreamSubject.asObservable();
  chatMessages$ = this.chatMessagesSubject.asObservable();
  viewerCount$ = this.viewerCountSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  private roomId: string | null = null;
  private username: string | null = null;

  constructor() {
    // this._socket = io(
    //   'http://localhost:3000',
    //   ,{   {
    //     transports: ['websocket'],
    //     withCredentials: true,
    //   } }),
    // this._socket = io('http://localhost:3000', {
    //   transports: ['websocket'],
    //   withCredentials: true,
    // });
    this._socket = io('https://capturelive.onrender.com', {
      transports: ['websocket'],
      withCredentials: true,
    });
    // this._socket = io('https://onlineecart.shop', {});

    this.initializeSocketEvents();
    this.handleChatMessages();
  }

  private initializeSocketEvents() {
    this._socket.on('connect', () => {
      console.log('Connected to socket server:', this._socket.id);
    });

    this._socket.on('offer', async (data) => {
      console.log(`Received offer from ${data.id}, SDP:`, data.offer.sdp);
      const peerConnection = this.createPeerConnection(data.id);
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this._socket.emit('answer', { id: data.id, answer });
        console.log(`Sent answer to ${data.id}, SDP:`, answer.sdp);
        this.processQueuedIceCandidates(data.id);
      } catch (err) {
        console.error('Error handling offer:', err);
        this.errorSubject.next('Failed to handle offer');
      }
    });

    this._socket.on('answer', async (data) => {
      console.log(`Received answer from ${data.id}, SDP:`, data.answer.sdp);
      const peerConnection = this.peerConnections[data.id];
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          console.log(`Set remote description for ${data.id}`);
          this.processQueuedIceCandidates(data.id);
        } catch (err) {
          console.error('Error handling answer:', err);
          this.errorSubject.next('Failed to handle answer');
        }
      } else {
        console.warn(`No peer connection for ${data.id}`);
      }
    });

    this._socket.on('ice-candidate', async (data) => {
      console.log(`Received ICE candidate from ${data.id}`);
      const peerConnection = this.peerConnections[data.id];
      if (peerConnection) {
        if (peerConnection.remoteDescription) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
            console.log(`Added ICE candidate from ${data.id}`);
          } catch (err) {
            console.error('ICE candidate error:', err);
            this.errorSubject.next('Failed to add ICE candidate');
          }
        } else {
          console.log(
            `Queuing ICE candidate from ${data.id} (no remote description)`
          );
          if (!this.iceCandidateQueues[data.id]) {
            this.iceCandidateQueues[data.id] = [];
          }
          this.iceCandidateQueues[data.id].push(data.candidate);
        }
      } else {
        console.warn(`No peer connection for ${data.id}`);
      }
    });

    this._socket.on('viewer-joined', (viewerId) => {
      console.log(`Viewer joined: ${viewerId}`);
      const peerConnection = this.createPeerConnection(viewerId);
      if (this.broadcasterStream) {
        console.log(
          `Adding broadcaster stream tracks to ${viewerId}:`,
          this.broadcasterStream.getTracks()
        );
        this.broadcasterStream.getTracks().forEach((track) => {
          const alreadyAdded = peerConnection
            .getSenders()
            .some((sender) => sender.track === track);
          if (!alreadyAdded) {
            peerConnection.addTrack(track, this.broadcasterStream!);
            console.log(
              `Added track ${track.kind} to peer connection for ${viewerId}`
            );
          }
        });
      }
      this.createOffer(viewerId);
    });

    this._socket.on('viewer count', (data) => {
      console.log(`Viewer count: ${data.count}`);
      this.viewerCountSubject.next(data.count);
    });

    this._socket.on('error', (data) => {
      console.error(`Socket error: ${data.message}`);
      this.errorSubject.next(data.message);
    });

    this._socket.on('broadcaster-left', () => {
      console.log('Broadcaster left');
      this.errorSubject.next('Broadcaster has left the room');
    });
  }

  private handleChatMessages() {
    this._socket.on('chat message', (data) => {
      console.log('Chat data from the signaling server', data);
      const { username, message, messageType, timestamp, audioUrl } = data;
      this.chatMessagesSubject.next({
        username,
        message: messageType === 'audio' ? '' : message,
        timestamp: new Date(timestamp),
        type: messageType,
        audioUrl: messageType === 'audio' ? audioUrl : undefined,
      });
    });
  }

  private createPeerConnection(peerId: string): RTCPeerConnection {
    if (this.peerConnections[peerId]) {
      console.log(`Reusing existing peer connection for ${peerId}`);
      return this.peerConnections[peerId];
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this._socket.emit('ice-candidate', {
          id: peerId,
          candidate: event.candidate,
        });
        console.log(`Sent ICE candidate to ${peerId}`);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log(
        `Received remote track from ${peerId}, streams:`,
        event.streams
      );
      if (event.streams && event.streams[0]) {
        const remoteStream = event.streams[0];
        console.log(`Remote stream tracks:`, remoteStream.getTracks());
        if (remoteStream.getTracks().length > 0) {
          this.remoteStreamSubject.next(remoteStream);
        } else {
          console.warn(`Remote stream from ${peerId} has no tracks`);
        }
      } else {
        console.warn(`No streams in ontrack event from ${peerId}`);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state for ${peerId}: ${peerConnection.iceConnectionState}`
      );
      if (peerConnection.iceConnectionState === 'failed') {
        peerConnection.restartIce();
      }
    };

    this.peerConnections[peerId] = peerConnection;
    return peerConnection;
  }

  private async createOffer(peerId: string) {
    const peerConnection = this.peerConnections[peerId];
    if (!peerConnection) {
      console.warn(`No peer connection for ${peerId}`);
      return;
    }
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      this._socket.emit('offer', { id: peerId, offer });
      console.log(`Sent offer to ${peerId}, SDP:`, offer.sdp);
    } catch (err) {
      console.error('Error creating offer:', err);
      this.errorSubject.next('Failed to create offer');
    }
  }

  private async processQueuedIceCandidates(peerId: string) {
    const queue = this.iceCandidateQueues[peerId];
    if (queue && queue.length > 0) {
      console.log(
        `Processing ${queue.length} queued ICE candidates for ${peerId}`
      );
      const peerConnection = this.peerConnections[peerId];
      for (const candidate of queue) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`Added queued ICE candidate for ${peerId}`);
        } catch (err) {
          console.error('Error adding queued ICE candidate:', err);
        }
      }
      this.iceCandidateQueues[peerId] = [];
    }
  }

  joinRoom(roomId: number, role: 'broadcaster' | 'viewer') {
    this.roomId = roomId.toString();
    const storedUserName = localStorage.getItem('userName');
    this.username =
      (storedUserName ? storedUserName : 'user_') + this._socket.id;
    this._socket.emit('join room', {
      room: this.roomId,
      role,
      username: this.username,
    });
    console.log(`Joined room ${roomId} as ${role}`);
  }

  handleAddTrack(stream: MediaStream) {
    console.log(`Storing broadcaster stream tracks:`, stream.getTracks());
    this.broadcasterStream = stream;
  }

  handleReplaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack) {
    console.log(`Trying to replace ${oldTrack.kind} with ${newTrack.kind}`);
    Object.values(this.peerConnections).forEach((peerConnection) => {
      const sender = peerConnection
        .getSenders()
        .find((s) => s.track === oldTrack);
      if (sender) {
        sender.replaceTrack(newTrack);
        console.log(`Replaced track in peer connection`);
        if (this.broadcasterStream) {
          this.broadcasterStream.removeTrack(oldTrack);
          this.broadcasterStream.addTrack(newTrack);
          console.log(
            `Updated broadcaster stream tracks:`,
            this.broadcasterStream.getTracks()
          );
        }
      } else {
        console.warn(`No sender found for track ${oldTrack.kind}`);
      }
    });
  }

  sendMessage(
    username: string,
    message: string,
    messageType: 'text' | 'audio'
  ) {
    if (this.roomId && this.username) {
      this._socket.emit('chat message', {
        room: this.roomId,
        message,
        username: username,
        messageType,
      });
      console.log(`Sent ${messageType} message to room ${this.roomId}:`, {
        message,
        username: this.username,
        messageType,
      });
    } else {
      console.error('Error sending message: roomId or username not set');
      this.errorSubject.next(
        'Failed to send message: Room ID or username missing'
      );
    }
  }

  setRemoteStream(stream: MediaStream) {
    console.log(`Manually setting remote stream:`, stream.getTracks());
    this.remoteStreamSubject.next(stream);
  }

  disconnect() {
    console.log('Disconnecting socket and closing peer connections');
    this._socket.disconnect();
    Object.values(this.peerConnections).forEach((pc) => pc.close());
    this.peerConnections = {};
    this.iceCandidateQueues = {};
    this.broadcasterStream = null;
    this.roomId = null;
    this.username = null;
  }
}
