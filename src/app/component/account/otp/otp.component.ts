import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { signupCredential } from '../../../model/auth';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent implements OnInit, OnDestroy {
  private _otpSubscription!: Subscription ;
  private _resendOtpSubscription!: Subscription ;
  otpform!: FormGroup;
  start: boolean = true;
  value: number = 60;
  stop: boolean = false;
  intervaltimer!: any;
  fb: any;
  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.otpform = this._fb.group({
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
    this.timer();
    console.log('storage value', localStorage);
  }
  otpsubmit() {
    console.log(this.otpform.value);
    this._otpSubscription = this._service.otp(this.otpform.value).subscribe({
      next: (res) => {
        console.log('response after otp', res);
        if (res && res.message) {
          this._toastr.success(res.message);
          this._router.navigate(['/login']);
          this.otpform.reset();
        }
      },
      error: (err) => {
        if (err && err.error.message) {
          this._toastr.error(err.error.message);
          this.otpform.reset();
        }
      },
    });
  }
  timer() {
    this.intervaltimer = setInterval(() => {
      if (this.start && !this.stop && this.value > 0) {
        this.value--;
      } else if (this.value === 0) {
        this.stop = true;
        clearInterval(this.intervaltimer);
      }
    }, 1000);
  }

  resendotp() {
    this.timer();
    const userdata: string | null = localStorage.getItem('userMail');
    if (userdata !== null) {
      const user = JSON.parse(userdata);
     this._resendOtpSubscription= this._service.resendotp(user).subscribe({
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
    clearInterval(this.intervaltimer);
    this._otpSubscription?.unsubscribe();
    this._resendOtpSubscription?.unsubscribe()
  }
}
