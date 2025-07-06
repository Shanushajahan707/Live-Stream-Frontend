import { Component } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  sidebarVisible: boolean = false;
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
