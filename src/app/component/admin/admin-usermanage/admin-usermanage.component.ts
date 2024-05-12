import { Component, OnInit } from '@angular/core';
import { UsermanageService } from '../../../service/usermanage.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../model/auth';

@Component({
  selector: 'app-admin-usermanage',
  templateUrl: './admin-usermanage.component.html',
  styleUrl: './admin-usermanage.component.scss',
})
export class AdminUsermanageComponent implements OnInit {
  constructor(
    private _service: UsermanageService,
    private _toaster: ToastrService
  ) {}

  displayedUsers: User[] = [];
  users: User[] = [];
  visible: boolean = false;

  // In your component class
  ngOnInit(): void {
    this._service.getUsers().subscribe({
      next: (res) => {
        if (res && res.message) {
          this.users = res.users;
        }
      },
    });

    console.log('users are', this.users);
  }
  toggleBlockStatus(user: User) {
    this._service.blockuser(user._id).subscribe({
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
}
