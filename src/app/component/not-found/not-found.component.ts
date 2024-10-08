import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    this.initializeFlicker();
  }

  initializeFlicker(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width = 700;
    const HEIGHT = canvas.height = 500;
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, WIDTH, HEIGHT);

    let imgData = ctx!.getImageData(0, 0, WIDTH, HEIGHT);
    let pix = imgData.data;

    setInterval(() => {
      for (let i = 0; i < pix.length; i += 4) {
        const color = (Math.random() * 255) + 50;
        pix[i] = color;
        pix[i + 1] = color;
        pix[i + 2] = color;
      }
      ctx!.putImageData(imgData, 0, 0);
    }, 30);
  }
}
