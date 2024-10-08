import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Parallax from 'parallax-js';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements AfterViewInit{
  
  @ViewChild('scene', { static: true }) scene!: ElementRef;

  ngAfterViewInit() {
    const parallaxInstance = new Parallax(this.scene.nativeElement, {
      hoverOnly: false
    });
  }
}
