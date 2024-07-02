import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionmanageService } from '../../../service/admin/subscription/subscriptionmanage.service';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionData } from '../../../model/auth';
@Component({
  selector: 'app-adminwebsitesubscription',
  templateUrl: './adminwebsitesubscription.component.html',
  styleUrls: ['./adminwebsitesubscription.component.scss'],
})
export class AdminwebsitesubscriptionComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  websiteSubscriptionPlan: SubscriptionData[] = [];
  subscriptionForm: FormGroup;
  isModalVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _subscriptionService: SubscriptionmanageService,
    private _toaster: ToastrService
  ) {
    this.subscriptionForm = this._fb.group({
      month: [
        '',
        [
          Validators.required,
          Validators.max(12),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this._subscriptionService
      .getPlan()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            // console.log(res.plan);
            this.websiteSubscriptionPlan = res.plan;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  editItem(planId: string) {
    console.log('Editing item:', planId);
    // Implement your editing logic here
  }

  addSubscription() {
    if (this.subscriptionForm.valid) {
      console.log('form valus', this.subscriptionForm.value);
      this._subscriptionService
        .insertSusbcription(this.subscriptionForm.value)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res) {
              this._toaster.show(res.message);
              this.websiteSubscriptionPlan = res.newplan;
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });

      this.subscriptionForm.reset();
      this.closeModal();
    } else {
      console.log('Form is invalid');
    }
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
