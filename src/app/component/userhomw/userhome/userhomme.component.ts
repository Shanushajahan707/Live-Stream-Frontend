import { Component } from '@angular/core';
import { AccountService } from '../../../service/account.service';

@Component({
  selector: 'app-userhomme',
  templateUrl: './userhomme.component.html',
  styleUrl: './userhomme.component.scss',
})
export class UserhomeComponent {
  constructor(private _service: AccountService) {}
  Oninit() {
    console.log('logged userhome', this._service.islogged$);
  }
}
