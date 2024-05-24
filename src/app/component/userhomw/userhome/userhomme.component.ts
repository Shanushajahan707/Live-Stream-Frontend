import { Component } from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { Store, select } from '@ngrx/store';
import { UserState } from '../../../store/userlogin/login-reducer';
import { Observable, map } from 'rxjs';
import { selectUser } from '../../../store/userlogin/login-selector';
import { User } from '../../../model/auth';
@Component({
  selector: 'app-userhomme',
  templateUrl: './userhomme.component.html',
  styleUrl: './userhomme.component.scss',
})
export class UserhomeComponent {
  user$: Observable<User | null>;
  visible: boolean = false;
  sidebarVisible1: boolean = false;

  constructor(
    private _service: AccountService,
    private store: Store<UserState>
  ) {
    this.user$ = this.store.pipe(select(selectUser));
    this.user$.subscribe((res) => {
      console.log(res);
    });
  }
  Oninit() {
    console.log(
      'logged userhome',
      this._service.islogged$,
      this.user$.subscribe((res) => {
        console.log(res);
      })
    );
  }

}
