import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/user/account/account.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-landinghome',
  templateUrl: './landinghome.component.html',
  styleUrl: './landinghome.component.scss',
})
export class LandinghomeComponent implements OnInit {
  private readonly $destroy = new Subject<void>();
  acknowledge!: boolean;
  constructor(private _service: AccountService) {}

  ngOnInit(): void {
    this.ack()
  }

  ack() {
    this._service
      .ack()
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          if (res && res.ack) {
            console.log('ack response', res);
            this.acknowledge = res.ack;
          }
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }
}
