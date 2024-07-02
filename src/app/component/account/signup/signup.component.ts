import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AccountService } from '../../../service/user/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _signup!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService
  ) {}

  public hidePassword = true;

  ngOnInit(): void {
    this._signup = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, this.emailValidator.bind(this)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      dateofbirth: ['', [Validators.required]],
    });
  }
  onsubmit() {
    if (this._signup.valid) {
      console.log(this._signup.value);
      this._toastr.warning('Processing');
      const signupdata = JSON.stringify(this._signup.value);
      localStorage.setItem('userMail', signupdata);
      this.sendSignupDate(this._signup.value);
    }
  }

  sendSignupDate(data: any) {
    console.log('valu', data);
    this._service
      .signup(data)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message);
            this._signup.reset();
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toastr.error(err.error.message);
          }
        },
      });
  }
  emailValidator(control: FormControl): { [s: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailPattern.test(control.value)) {
      return { emailInvalid: true };
    }
    return null;
  }

  passwordMatchValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    if (control.value !== control.root.get('password')?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
