import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private currentTime = new BehaviorSubject<Date>(new Date());
  private intervalId!: any;

  constructor() {
    this.startUpdatingTime();
  }

  startUpdatingTime(): void {
    this.currentTime.next(new Date());
  }

  stopUpdatingTime(): void {}

  getCurrentTime(): Observable<Date> {
    return this.currentTime.asObservable();
  }
}
