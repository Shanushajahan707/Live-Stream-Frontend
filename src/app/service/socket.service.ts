import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _socket: Socket;
  private _remoteId!: string;

  private remoteStreamSubject = new Subject<MediaStream>();
  remoteStream$ = this.remoteStreamSubject.asObservable();

  peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ],
  });

  constructor() {
    this._socket = io('http://localhost:3000', {});
    this._socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this._socket.on('connect', () => {
      console.log('Successfully connected to socket server');
    });

    this.handleUserJoined();
    this.handleOffer();
    this.handleAnswer();
    this.handleRemoteStream();
    this.handleICECandidates();
    this.peerNegotiationNeeded();
    this.peerNegoIncoming();
    this.peerNegoFinal();
  }

  joinRoom(room: number, role: string) {
    const data = { room, role };
    console.log('join room', data);
    this._socket.emit('join room', data);
  }

  handleUserJoined() {
    this._socket.on('user joined', (data) => {
      console.log('user joined', data.role, data.id);
      this._remoteId = data.id;
      if (data.role === 'viewer') {
        this.createOffer(data.id);
      }
    });

    this._socket.on('viewer-joined', (viewerId) => {
      console.log('Viewer joined', viewerId);
      this.createOffer(viewerId);
    });
  }

  createOffer(id: string) {
    this.peer
      .createOffer()
      .then((offer) => {
        return this.peer.setLocalDescription(offer).then(() => {
          console.log('local description set', offer);
          this._socket.emit('offer', { id: id, offer });
        });
      })
      .catch((error) => console.error('createOffer error:', error));
  }

  handleOffer() {
    this._socket.on('offer', async (data) => {
      console.log('Offer received', data);
      await this.peer.setRemoteDescription(data.offer);
      this.peer
        .createAnswer()
        .then((answer) => {
          this.peer.setLocalDescription(answer).then(() => {
            this._socket.emit('answer', {
              id: data.id,
              answer,
            });
          });
        })
        .catch((error) => console.error('createAnswer error:', error));
    });
  }

  handleAnswer() {
    this._socket.on('answer', async (data) => {
      console.log('Answer received', data);
      await this.peer.setRemoteDescription(data.answer);
    });
  }

  handleRemoteStream() {
    this.peer.addEventListener('track', async (event) => {
      const [remoteStream] = event.streams;
      this.remoteStreamSubject.next(remoteStream);
    });
  }

  handleAddTrack(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }

  handleICECandidates() {
    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this._socket.emit('ice-candidate', {
          id: this._remoteId,
          candidate: event.candidate,
        });
      }
    };

    this._socket.on('ice-candidate', (data) => {
      this.peer
        .addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch((error) =>
          console.error('Error adding received ice candidate', error)
        );
    });
  }

  peerNegotiationNeeded() {
    this.peer.onnegotiationneeded = async () => {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      this._socket.emit('peer-nego-needed', {
        id: this._remoteId,
        offer: this.peer.localDescription,
      });
    };
  }

  peerNegoIncoming() {
    this._socket.on('peer-nego-needed', async (data) => {
      const { offer } = data;
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      this._socket.emit('peer-nego-done', {
        id: this._remoteId,
        answer: this.peer.localDescription,
      });
    });
  }

  peerNegoFinal() {
    this._socket.on('peer-nego-final', async (data) => {
      const { answer } = data;
      await this.peer.setRemoteDescription(answer);
    });
  }

  handleReplaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack) {
    oldTrack.stop();
    newTrack.enabled = true;
    this.peer.addTrack(newTrack);
  }

  disconnect() {
    this._socket.disconnect();
  }
}
