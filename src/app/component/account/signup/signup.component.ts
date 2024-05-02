import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { NotExpr } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  signup!: FormGroup;
  private _signupSubsription: Subscription | undefined;
  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService
  ) {}

  public hidePassword = true;

  ngOnInit(): void {
    this.signup = this._fb.group({
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
    if (this.signup.valid) {
      console.log(this.signup.value);
      this._toastr.warning('Processing');
      const signupdata = JSON.stringify(this.signup.value);
      localStorage.setItem('userMail', signupdata);
      this.sendSignupDate(this.signup.value);
    }
  }

  sendSignupDate(data: any) {
    console.log('valu',data);
    this._signupSubsription = this._service.signup(data).subscribe({
      next: (res) => {
        if (res && res.message) {
          this._toastr.success(res.message);
          this.signup.reset();
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
    if (this._signupSubsription) {
      this._signupSubsription.unsubscribe();
    }
  }
}
