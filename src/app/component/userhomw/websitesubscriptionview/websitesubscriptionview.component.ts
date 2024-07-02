import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../service/user/subscription/subscription.service';
import { SubscriptionData } from '../../../model/auth';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-websitesubscriptionview',
  templateUrl: './websitesubscriptionview.component.html',
  styleUrls: ['./websitesubscriptionview.component.scss'],
})
export class WebsitesubscriptionviewComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  SubscriptionPlan: SubscriptionData[] = [];
  razorpaykey: string = environment.razorKey;
  plan!: SubscriptionData;

  constructor(
    private _websitePlanService: SubscriptionService,
    private _toaster: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._websitePlanService
      .onGetWebsiteSubscription()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.show(res.message);
            this.SubscriptionPlan = res.websiteSubscription;
          }
        },
        error: (err) => {
          if (err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  generateColor(index: number): string {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  makePayment(plan: SubscriptionData) {
    this.plan = plan;
    const options = {
      key: this.razorpaykey,
      amount: plan.price * 100,
      currency: 'INR',
      name: 'Live Stream PVT',
      description: `${plan.month} Month Subscription`,
      image: '',
      order_id: '', // Optional: You can pass pre-generated order_id here
      handler: (response: any) => {
        this.paymentSuccess(response, plan);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Customer Address',
      },
      theme: {
        color: '#F37254',
      },
      modal: {
        ondismiss: this.paymentFailure,
        escape: false, // Prevents closing modal on ESC key press
        backdropclose: false, // Prevents closing modal on clicking backdrop
        class_name: 'razorpay-payment-modal', // Apply custom CSS class to modal
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  paymentSuccess(response: any, plan: SubscriptionData) {
    // Handle success scenario after payment
    console.log('Payment successful!', response);
    // You can add further logic here, such as updating the UI or sending payment details to the server

    this._websitePlanService
      .onSubscribeWebsite(plan._id, response.razorpay_payment_id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && res.message) {
            if (res.payment) {
              this._router.navigateByUrl('userhome');
              this._toaster.success('Time Period Is Extended');
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

  paymentFailure() {
    // Handle failure scenario after payment
    console.log('Payment failed or dismissed by user.');
    this._toaster.error('Payment failed or dismissed by user.');
    // You can add further logic here, such as displaying an error message or retrying payment
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
