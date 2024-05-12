import { Component } from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss',
})
export class RecommendationComponent {
  showMenu: boolean = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
 }

  recommendations: any[] = [
    {
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrijjw-xF369QwQgouTEJBEeOAq0cLETni17kfUVuUvw&simages.png', // Placeholder image
      channelName: 'Channel A',
      viewsCount: 1500,
    },
    {
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrijjw-xF369QwQgouTEJBEeOAq0cLETni17kfUVuUvw&simages.png', // Placeholder image
      channelName: 'Channel B',
      viewsCount: 800,
    },
    {
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrijjw-xF369QwQgouTEJBEeOAq0cLETni17kfUVuUvw&simages.png', // Placeholder image
      channelName: 'Channel C',
      viewsCount: 1200,
    },
    {
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrijjw-xF369QwQgouTEJBEeOAq0cLETni17kfUVuUvw&simages.png', // Placeholder image
      channelName: 'Channel D',
      viewsCount: 600,
    },
    {
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrijjw-xF369QwQgouTEJBEeOAq0cLETni17kfUVuUvw&simages.png', // Placeholder image
      channelName: 'Channel E',
      viewsCount: 2000,
    },
  ];

  
}
