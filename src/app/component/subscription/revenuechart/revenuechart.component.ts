import { Component } from '@angular/core';
import { SubscriptionService } from '../../../service/user/subscription.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OverallData } from '../../../model/auth';

@Component({
  selector: 'app-revenuechart',
  templateUrl: './revenuechart.component.html',
  styleUrl: './revenuechart.component.scss',
})
export class RevenuechartComponent {
  private readonly _destroy$ = new Subject<void>();
  data: any;
  overallData!: OverallData;
  options: any;
  monthlySubscription: { [key: string]: number } = {};
  totalPayment!:number
  constructor(
    private _channelService: SubscriptionService,
    private _toaster: ToastrService
  ) {}

  ngOnInit() {
    this._channelService
      .getRevenueChart()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this._toaster.success(res.message);
            console.log(res.revenue);
            this.monthlySubscription = res.revenue;
            this.totalPayment=res.totalAmount
            this.setUpChartData();
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            precision: 0,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  setUpChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const colors = [
      '--blue-500',
      '--green-500',
      '--pink-500',
      '--orange-500',
      '--purple-500',
    ];

    const overallLabels = Object.keys(this.monthlySubscription).sort();
    const overallDataPoints = overallLabels.map(
      (label) => this.monthlySubscription[label]
    );

    this.overallData = {
      labels: overallLabels,
      datasets: [
        {
          label: 'Overall Monthly Enrollments',
          data: overallDataPoints,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };
  }
}
