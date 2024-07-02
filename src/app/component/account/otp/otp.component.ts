import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/user/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _otpform!: FormGroup;
  _start: boolean = true;
  _value: number = 60;
  _stop: boolean = false;
  _intervaltimer!: any;
  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.timer();

    this._otpform = this._fb.group({
      digit1: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      digit2: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      digit3: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      digit4: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      digit5: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      digit6: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
    });

    console.log('storage value', localStorage);
  }
  otpsubmit() {
    console.log(this._otpform.value);
    this._service
      .otp(this._otpform.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log('response after otp', res);
          if (res && res.message) {
            this._toastr.success(res.message);
            this._router.navigate(['/login']);
            this._otpform.reset();
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toastr.error(err.error.message);
            this._otpform.reset();
          }
        },
      });
  }
  timer() {
    this._intervaltimer = setInterval(() => {
      if (this._start && !this._stop && this._value > 0) {
        this._value--;
      } else if (this._value === 0) {
        this._stop = true;
        clearInterval(this._intervaltimer);
      }
    }, 1000);
  }

  resendotp() {
    this.timer();
    const userdata: string | null = localStorage.getItem('userMail');
    if (userdata !== null) {
      const user = JSON.parse(userdata);
      this._service
        .resendotp(user)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toastr.success(res.message);
              localStorage.removeItem('userMail');
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toastr.error(err.error.message);
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this._intervaltimer);
    this._destroy$.next();
    this._destroy$.complete();
  }
}
