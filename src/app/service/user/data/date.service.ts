import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
private currentTimeSubject = new BehaviorSubject<Date>(new Date());
  private updateInterval: any;

  getCurrentTime(): Observable<Date> {
    return this.currentTimeSubject.asObservable();
  }

  startUpdatingTime(): void {
    this.updateInterval = setInterval(() => {
      this.currentTimeSubject.next(new Date());
    }, 1000);
  }

  stopUpdatingTime(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
