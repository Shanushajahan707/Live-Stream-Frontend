import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LiveData {
  Livename: string;
  RoomId: number;
}

@Injectable({
  providedIn: 'root'
})

export class DataPassingService {
  private dataSource=new BehaviorSubject<LiveData>({Livename:'',RoomId:0})
  currentData=this.dataSource.asObservable()
  constructor() { }

  changeData(data:LiveData){
    this.dataSource.next(data)
  }
}
