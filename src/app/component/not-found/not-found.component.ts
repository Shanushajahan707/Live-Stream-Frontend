import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Parallax from 'parallax-js';
import { AccountService } from '../../service/user/account/account.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements AfterViewInit,OnInit{
  
  @ViewChild('scene', { static: true }) scene!: ElementRef;

  constructor(private _service:AccountService) {
    
  }

  ngAfterViewInit() {
    const parallaxInstance = new Parallax(this.scene.nativeElement, {
      hoverOnly: false
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._service.islogged$.next(false);
  }
}
