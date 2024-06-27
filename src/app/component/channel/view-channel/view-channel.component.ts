import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ChannelData,
  ChannelSubscriptionData,
  LiveHistory,
} from '../../../model/auth';
import { ChannelService } from '../../../service/user/channel.service';
import { SubscriptionService } from '../../../service/user/subscription.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { LiveService } from '../../../service/user/live.service';
declare var Razorpay: any;

@Component({
  selector: 'app-view-channel',
  templateUrl: './view-channel.component.html',
  styleUrls: ['./view-channel.component.scss'],
})
export class ViewChannelComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _channelId!: string;
  _selectedContent: string = 'shorts';
  _followChannel!: ChannelData;
  _responsiveOptions: any[] | undefined;
  _channelPlans: ChannelSubscriptionData[] = [];
  _selectedPlan!: ChannelSubscriptionData | null;
  isModelVisible: boolean = false;
  selectedPlan: string = '';
  isMember: boolean = false;
  razorPayKey: string = environment.razorKey;
  paypalClient: string = environment.paypalClientId;
  isPaymentSuccess!: string;
  liveHistory: LiveHistory[] = [];
  liveHistoryWithUsernames: any[] = [];

  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;
  public showPayPal: boolean = false;
  public showRazorpay: boolean = false;
  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  @ViewChild('paymentMethodModal', { static: false })
  paymentMethodModal!: ElementRef;

  private rzp1: any;

  constructor(
    private _route: ActivatedRoute,
    private _channelService: ChannelService,
    private _toaster: ToastrService,
    private _channelSubscription: SubscriptionService,
    private _liveService: LiveService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.pipe(takeUntil(this._destroy$)).subscribe((params) => {
      this._channelId = params.get('id') as string;
      console.log('channel id: ', this._channelId);

      this._channelService
        .onGetFollowChannel(this._channelId)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
              this._followChannel = res.channel;
              console.log(this._followChannel);
            }
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    });

    this._channelSubscription
      .isChannelMember(this._channelId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && res.message) {
            this.isMember = res.isMember;
            console.log(res.message);
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            console.log('error', err.error.message);
          }
        },
      });

    this._channelSubscription
      .onGetChannelSubscription()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toaster.success(res.message);
            this._channelPlans = res.channelPlans;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });

    this._responsiveOptions = [
      { breakpoint: '1199px', numVisible: 1, numScroll: 1 },
      { breakpoint: '991px', numVisible: 2, numScroll: 1 },
      { breakpoint: '767px', numVisible: 1, numScroll: 1 },
    ];
  }

  selectPlan(plan: ChannelSubscriptionData, index: number): void {
    this._selectedPlan = plan;
    this.paymentMethodModal.nativeElement.showModal();
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethodModal.nativeElement.close();
    this.myModal.nativeElement.close();
    if (method === 'paypal') {
      this.showPayPal = true;
      this.showRazorpay = false;
      this.myModal.nativeElement.showModal();
      this.initPayPalConfig(this.convertInrToEur(this._selectedPlan!.price));
    } else if (method === 'razorpay') {
      this.showPayPal = false;
      this.showRazorpay = true;
      this.openCheckout(this._selectedPlan!.price);
    }
  }

  private convertInrToEur(inr: number): number {
    const conversionRate = 0.011;
    return inr * conversionRate;
  }

  private initPayPalConfig(priceInEur: number): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: this.paypalClient,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: priceInEur.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: priceInEur.toFixed(2),
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: priceInEur.toFixed(2),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.showSuccess = true;
        this.myModal.nativeElement.close(); // Close the modal on successful payment
        //payment success
        this._channelSubscription
          .onSubscribe(
            this._followChannel._id,
            this._selectedPlan!._id,
            data.id
          )
          .pipe(takeUntil(this._destroy$))
          .subscribe({
            next: (res) => {
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
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;
        this._toaster.info('Payment cancelled');
        this.resetStatus();
        this.myModal.nativeElement.close(); // Close the modal on payment cancellation
      },
      onError: (err) => {
        console.log('OnError', err);
        this.showError = true;
        this._toaster.error('Payment error');
        this.resetStatus();
        this.myModal.nativeElement.close(); // Close the modal on error
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.resetStatus();
      },
    };
  }

  private resetStatus(): void {
    this.showSuccess = false;
    this.showCancel = false;
    this.showError = false;
    this.showPayPal = false;
    this.showRazorpay = false;
  }

  liveHistorys() {
    this._liveService
      .fetchLiveHistory(this._followChannel) // Replace with the actual channel ID
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res ) {
            this.liveHistory =res.liveHistory }
        },
        error: (err: any) => {
          if (err && err.error.message) {
            console.error(err.error.message);
          }
        },
      });
  }

  private options: any = {
    key: this.razorPayKey,
    amount: '',
    currency: 'INR',
    name: 'LiveStreamOnlinePVT',
    description: 'Channel Subscription',
    image: '',
    order_id: '',
    handler: (response: any) => {
      this.paymentSuccessHandler(response);
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#F37254',
    },
  };

  openCheckout(amount: number): void {
    this.options.amount = amount * 100;
    this.rzp1 = new Razorpay(this.options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.paymentFailureHandler(response);
    });
  }

  private paymentSuccessHandler(response: any): void {
    console.log('Payment Successful', response);
    this.showSuccess = true;
    this.showCancel = false;
    this.showError = false;
    this._channelSubscription
      .onSubscribe(
        this._followChannel._id,
        this._selectedPlan?._id as string,
        response.razorpay_payment_id
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res) {
            this._toaster.success(res.message);
            this.isPaymentSuccess = res.message;
            this.isMember = res.isMember;
            if (res.payment) {
              this._toaster.show('Payment success');
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

  private paymentFailureHandler(response: any): void {
    console.log('Payment Failed', response);
    this.showSuccess = false;
    this.showCancel = true;
    this.showError = true;
    this._toaster.error('Payment failed');
    this.resetStatus();
  }

  openModal() {
    this.isModelVisible = true;
    this.myModal.nativeElement.showModal();
  }

  onVideoPlay(videoItem: any) {
    console.log('played' + videoItem);
    const formData = new FormData();
    formData.append('videourl', videoItem);
    this._channelService
      .onUpdateViews(formData, this._followChannel._id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._followChannel.video.forEach((video) => {
              const updatedVideo = res.channel.video.find(
                (v) => v.url === video.url
              );
              if (updatedVideo) {
                video.views = updatedVideo.views;
              }
            });
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
