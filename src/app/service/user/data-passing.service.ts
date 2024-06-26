import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LiveData {
  Livename: string;
  RoomId: number;
}
interface JoinLive {
  Livename: string;
  RoomId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataPassingService {
  private dataSource = new BehaviorSubject<LiveData>({
    Livename: '',
    RoomId: 0,
  });
  currentData = this.dataSource.asObservable();
  private joinRoom = new BehaviorSubject<JoinLive>({ Livename: '', RoomId: 0 });
  joinroom = this.joinRoom.asObservable();
  constructor() {}

  changeData(data: LiveData) {
    // console.log('data 1', data);
    this.dataSource.next(data);
  }

  join(data: JoinLive) {
    // console.log('data 2', data);
    this.joinRoom.next(data);
  }
}
