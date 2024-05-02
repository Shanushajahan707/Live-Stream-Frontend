import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

  constructor(private _router:Router) {
    
  }

  logout(){
    localStorage.removeItem('admindata')
    this._router.navigate(['/login'])
  }
}
