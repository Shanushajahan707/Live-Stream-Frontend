import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelSubscriptionData } from '../../../model/auth';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriptionmanageService } from '../../../service/admin/subscriptionmanage.service';

@Component({
  selector: 'app-adminchannelsubscription',
  templateUrl: './adminchannelsubscription.component.html',
  styleUrls: ['./adminchannelsubscription.component.scss'],
})
export class AdminchannelsubscriptionComponent implements OnInit, OnDestroy {
  channelSubscriptionPlan: ChannelSubscriptionData[] = [];
  isModalVisible = false;
  subscriptionForm: FormGroup;
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _toaster: ToastrService,
    private _channelSubscription: SubscriptionmanageService
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
      description: this._fb.array([]), // Initialize the description as a FormArray
    });
  }

  ngOnInit(): void {
    this._channelSubscription
      .onGetChannelSubscription()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && res.message) {
            this._toaster.success(res.message);
            this.channelSubscriptionPlan = res.plan;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  get descriptionControls() {
    return this.subscriptionForm.get('description') as FormArray;
  }

  addDescriptionField() {
    this.descriptionControls.push(
      this._fb.group({
        desc: ['', Validators.required],
      })
    );
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  addSubscription() {
    if (this.subscriptionForm.valid) {
      this.isModalVisible = false;
      this._channelSubscription
        .onChannelAddSubscription(this.subscriptionForm.value)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res && res.message) {
              this._toaster.success(res.message);
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
