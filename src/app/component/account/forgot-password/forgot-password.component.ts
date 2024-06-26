import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/user/account.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _changePasswordForm!: FormGroup;
  _otpForm!: FormGroup;
  _isOtpVerified = false;
  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toaster: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._otpForm = this._fb.group({
      otp: ['', Validators.required],
    });

    this._changePasswordForm = this._fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onChangePasswordSubmit() {
    if (this._changePasswordForm.valid) {
      this._service
        .changePassword(this._changePasswordForm.value)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
            }
            this._router.navigateByUrl('');
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    }
  }
  onOtpSubmit() {
    if (this._otpForm.valid) {
      // Assume OTP verification logic here
      const otp = this._otpForm.get('otp')?.value;
      this._service
        .forgotPasswordOtp(otp)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
              if (res.otpvalue) {
                this._isOtpVerified = true;
              }
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
