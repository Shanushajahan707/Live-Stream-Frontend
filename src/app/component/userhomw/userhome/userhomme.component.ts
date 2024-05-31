import { Component ,DoCheck} from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { Store, select } from '@ngrx/store';
import { UserState } from '../../../store/userlogin/login-reducer';
import { Observable, map } from 'rxjs';
import { selectUser } from '../../../store/userlogin/login-selector';
import { User } from '../../../model/auth';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userhomme',
  templateUrl: './userhomme.component.html',
  styleUrl: './userhomme.component.scss',
})
export class UserhomeComponent implements DoCheck {
  user$: Observable<User | null>;
  visible: boolean = false;
  sidebarVisible1: boolean = false;
  jwtToken: string | null = null;
  userDetails!: User;

  constructor(
    private _service: AccountService,
    private store: Store<UserState>,
    private _router:Router
  ) {
    this.user$ = this.store.pipe(select(selectUser));
    this.user$.subscribe((res) => {
      console.log(res);
    });
    
    this.jwtToken = localStorage.getItem('token'); 
    if (this.jwtToken) {
      this.userDetails = jwtDecode(this.jwtToken);
      console.log('decode',this.userDetails);
    }
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
  ngDoCheck() {
    if (this.userDetails && this.userDetails.isblocked) {
      console.log('block')
      this._router.navigate(['/blocked-account']);
    }
  }

}
