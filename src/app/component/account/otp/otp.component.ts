import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('digit1') digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2') digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('digit3') digit3!: ElementRef<HTMLInputElement>;
  @ViewChild('digit4') digit4!: ElementRef<HTMLInputElement>;
  @ViewChild('digit5') digit5!: ElementRef<HTMLInputElement>;
  @ViewChild('digit6') digit6!: ElementRef<HTMLInputElement>;

  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.timer();

    this._otpform = this._fb.group({
      digit1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    });

    console.log('storage value', localStorage);
  }

  onDigitInput(event: Event, position: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow digits
    if (value && !/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }

    // Move to the next input if a digit is entered
    if (value.length === 1 && position < 6) {
      const nextInput = this.getInputElement(position + 1);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, position: number): void {
    const input = event.target as HTMLInputElement;

    // Move to the previous input on Backspace if the current input is empty
    if (event.key === 'Backspace' && !input.value && position > 1) {
      const prevInput = this.getInputElement(position - 1);
      if (prevInput) {
        prevInput.focus();
        prevInput.value = ''; // Clear the previous input
      }
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const digits = clipboardData.replace(/\D/g, '').split('').slice(0, 6);

    if (digits.length === 6) {
      for (let i = 0; i < 6; i++) {
        this._otpform.get(`digit${i + 1}`)?.setValue(digits[i]);
      }
      this.digit6.nativeElement.focus();
    }
  }

  private getInputElement(position: number): HTMLInputElement | null {
    switch (position) {
      case 1: return this.digit1.nativeElement;
      case 2: return this.digit2.nativeElement;
      case 3: return this.digit3.nativeElement;
      case 4: return this.digit4.nativeElement;
      case 5: return this.digit5.nativeElement;
      case 6: return this.digit6.nativeElement;
      default: return null;
    }
  }

  otpsubmit(): void {
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

  timer(): void {
    this._intervaltimer = setInterval(() => {
      if (this._start && !this._stop && this._value > 0) {
        this._value--;
      } else if (this._value === 0) {
        this._stop = true;
        clearInterval(this._intervaltimer);
      }
    }, 1000);
  }

  resendotp(): void {
    this._value = 60; // Reset timer
    this._stop = false;
    this._start = true;
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
