import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { onClose } from 'david-ui-angular/lib/types/componentTypes/chip';

@Component({
  selector: 'app-blocked-account',
  templateUrl: './blocked-account.component.html',
  styleUrl: './blocked-account.component.scss'
})
export class BlockedAccountComponent implements OnInit,OnDestroy {
  isBlocked:boolean=true
  constructor(private _router:Router) {}

  buttonColor = 'rgb(59, 130, 246)';
  private colorChangeInterval: any;

  ngOnInit() {
    this.startColorChange();
  }

  ngOnDestroy() {
    this.stopColorChange();
  }

  startColorChange() {
    this.colorChangeInterval = setInterval(() => {
      this.buttonColor = this.getRandomColor();
    }, 1000); 
  }

  stopColorChange() {
    if (this.colorChangeInterval) {
      clearInterval(this.colorChangeInterval);
    }
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  goBack() {
    console.log('Go Back button clicked');
    this._router.navigateByUrl('')
  }
}
