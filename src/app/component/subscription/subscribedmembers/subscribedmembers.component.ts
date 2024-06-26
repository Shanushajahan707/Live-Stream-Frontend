import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionService } from '../../../service/user/subscription.service';
import { Subject, takeUntil } from 'rxjs';
import { ChannelSubscriptionUsers } from '../../../model/auth';

@Component({
  selector: 'app-subscribedmembers',
  templateUrl: './subscribedmembers.component.html',
  styleUrl: './subscribedmembers.component.scss',
})
export class SubscribedmembersComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  members: ChannelSubscriptionUsers[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = 0;
  constructor(
    private _toaster: ToastrService,
    private _subscriptionService: SubscriptionService
  ) {}
  ngOnInit(): void {
    this.fetchMember();
  }

  async fetchMember() {
    try {
      this._subscriptionService
        .getAllSubscribedMember(this.currentPage, this.itemsPerPage)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.show(res.message);
              this.members = res.members;
              this.totalPages = Math.ceil(res.totalcount / this.itemsPerPage);
              // console.log(res.members);
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    } catch (error) {
      throw error;
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchMember();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchMember();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
