import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
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
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478",
        ],
      },
    ],
  });
  
  constructor() {
    this._socket = io('http://localhost:3000', {});
    console.log(this._socket);
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
    this.peerNegotiationNeeded();
    this.peerNegoIncoming();
    this.peerNegoFinal();
  }
  
  joinRoom(room: number, role: string) {
    const data = { room, role };
    this._socket.emit('join room', data);
  }
  
  handleUserJoined() {
    this._socket.on('user joined', (data) => {
      console.log('user joined', data.role, data.id);
      this._remoteId = data.id;
      this.createOffer(data.id);
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
      .catch((error) => {
        console.log('error creating offer', error);
        throw error;
      });
  }
  
  handleOffer() {
    console.log('inside handling offer');
    this._socket.on('offer', (data) => {
      console.log('offer', data.offer, 'from', data.id);
      this._remoteId = data.id;
      this.peer
        .setRemoteDescription(data.offer)
        .then(() => {
          return this.peer.createAnswer();
        })
        .then((answer) => {
          return this.peer.setLocalDescription(answer).then(() => {
            console.log('answer', data.id, answer);
            this._socket.emit('answer', { id: data.id, answer: answer });
          });
        })
        .catch((error) => {
          console.log('error handling offer and answer', error);
          throw error;
        });
    });
  }
  
  handleAnswer() {
    this._socket.on('answer', (data) => {
      console.log('handling answer', data);
      this.peer
        .setRemoteDescription(data.answer)
        .then(() => {
          console.log('Remote description set successfully');
        })
        .catch((error) => {
          console.log('error setting the remote description', error);
        });
    });
  }
  
  handleAddTrack(localStream: MediaStream) {
    localStream
      .getTracks()
      .forEach((track) => this.peer.addTrack(track, localStream));
  }
  
  handleRemoteStream() {
    this.peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      console.log('remote stream from the service', remoteStream);
      this.remoteStreamSubject.next(remoteStream);
    };
  }
  
  replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack) {
    const sender = this.peer.getSenders().find((s) => s.track === oldTrack);
    console.log('sender',sender);
    if (sender) {
      sender.replaceTrack(newTrack);
      this.peerNegotiationNeeded();
    }
  }

  peerNegotiationNeeded() {
    this.peer.addEventListener('negotiationneeded', async (ev) => {
      try {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        this._socket.emit('peer-nego-needed', { id: this._remoteId, offer });
      } catch (error) {
        console.log('error creating offer', error);
        throw error;
      }
    });
  }
  
  peerNegoIncoming() {
    this._socket.on('peer-nego-needed', async (data) => {
      try {
        await this.peer.setRemoteDescription(data.offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        console.log('peer nego answer', data.id, answer);
        this._socket.emit('peer-nego-done', { id: data.id, answer });
      } catch (error) {
        console.log('error generating answer', error);
      }
    });
  }
  
  peerNegoFinal() {
    this._socket.on('peer-nego-final', async (data) => {
      console.log('handling peer nego final', data.answer);
      try {
        await this.peer.setRemoteDescription(data.answer);
        console.log('peer nego final successfully');
      } catch (error) {
        console.log('error in peer nego final', error);
      }
    });
  }

 

  disconnect(){
    this._socket.disconnect()
  }
}