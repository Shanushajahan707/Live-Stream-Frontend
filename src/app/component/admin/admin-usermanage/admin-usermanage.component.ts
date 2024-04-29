import { Component, OnInit } from '@angular/core';
import { UsermanageService } from '../../../service/usermanage.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../model/auth';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-admin-usermanage',
  templateUrl: './admin-usermanage.component.html',
  styleUrl: './admin-usermanage.component.scss',
})
export class AdminUsermanageComponent implements OnInit {
  constructor(
    private service: UsermanageService,
    private toaster: ToastrService
  ) {}
  users: User[] = [];

  toggleBlockStatus(user: User) {
    this.service.blockuser(user._id).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.toaster.success(res.message);
        }
      },
      error: (err) => {
        if (err && err.error.message) {
          this.toaster.error(err.error.message);
        }
      },
    });
  }
  
  ngOnInit(): void {
    this.service.getUsers().subscribe({
      next: (res) => {
        if (res && res.message) {
          this.users = res.users;
        }
      },
    });

    console.log('users are', this.users);
  }
}
