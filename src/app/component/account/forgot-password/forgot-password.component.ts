import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this._otpForm = this._fb.group({
      otp: ['', Validators.required],
    });

    this._changePasswordForm = this._fb.group(
      {
        oldPassword: ['', Validators.required],
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

  onChangePasswordSubmit(): void {
    if (this._changePasswordForm.valid) {
      alert('Password changed successfully');
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
