import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsermanageService } from '../../../service/usermanage.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../model/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-usermanage',
  templateUrl: './admin-usermanage.component.html',
  styleUrl: './admin-usermanage.component.scss',
})
export class AdminUsermanageComponent implements OnInit, OnDestroy {
  constructor(
    private _service: UsermanageService,
    private _toaster: ToastrService
  ) {}

  private _getUsersSubscription!: Subscription;
  private _blockuserSubscription!: Subscription;
  displayedUsers: User[] = [];
  users: User[] = [];
  visible: boolean = false;
  currentPage = 1;
  itemsPerPage = 1;
  totalPages = 0;

  // In your component class

  ngOnInit(): void {
    this.fetchUsers();
  }
  // alert(this.users)
  // this.totalPages = Math.ceil(data.users.length / this.itemsPerPage);
  async fetchUsers() {
    try {
      this._getUsersSubscription = this._service
        .getUsers(this.currentPage, this.itemsPerPage)
        .subscribe({
          next: (res) => {
            console.log('res', res);
            this.users = res.users;
            console.log('user', this.users);
            this.totalPages = Math.ceil(res.totalcount / this.itemsPerPage);
            if (res && res.message) {
              this._toaster.success(res.message);
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    } catch (error) {
      console.error(error);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  toggleBlockStatus(user: User) {
    this._blockuserSubscription = this._service.blockuser(user._id).subscribe({
      next: (res) => {
        if (res && res.message) {
          this._toaster.success(res.message);
          this.users = this.users.map((u) =>
            u._id === res.user._id
              ? { ...u, ...res.user, showDialog: false }
              : u
          );
        }
      },
      error: (err) => {
        if (err && err.error.message) {
          this._toaster.error(err.error.message);
        }
      },
    });
  }

  showDialog() {
    this.visible = true;
  }

  ngOnDestroy(): void {
    this._getUsersSubscription?.unsubscribe();
    this._blockuserSubscription?.unsubscribe();
  }
}
