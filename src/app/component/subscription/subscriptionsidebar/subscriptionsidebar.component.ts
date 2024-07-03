import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriptionsidebar',
  templateUrl: './subscriptionsidebar.component.html',
  styleUrl: './subscriptionsidebar.component.scss',
})
export class SubscriptionsidebarComponent implements OnInit {
  isSidebarOpen: boolean = false;
  sidebarVisible: boolean = false;
  ngOnInit(): void {}
  constructor(private _router: Router) {}
  subscriptionview() {
    this.sidebarVisible = false;
    this._router.navigateByUrl('/subscription/view');
  }
  members() {
    this.sidebarVisible = false;
    this._router.navigateByUrl('/subscription/members');
  }
  revenue() {
    this.sidebarVisible = false;
    this._router.navigateByUrl('/subscription/revenuechart');
  }
}
