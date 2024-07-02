import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../service/user/account/account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  _isLogged: boolean = false;
  private readonly _destroy$ = new Subject<void>();

  constructor(private _service: AccountService) {}
  ngOnInit(): void {
    this._service.islogged$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isLogged = this._service.islogged();
    });
  }
}
