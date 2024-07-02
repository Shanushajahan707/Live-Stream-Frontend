import { Component } from '@angular/core';
import { SubscriptionService } from '../../../service/user/subscription/subscription.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OverallData } from '../../../model/auth';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'; // Ensure this line remains
import { ChannelService } from '../../../service/user/channel/channel.service';

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
  totalPayment!: number;


  constructor(
    private _subscription: SubscriptionService,
    private _toaster: ToastrService,
    private _channelService:ChannelService

  ) {}

  ngOnInit() {
    this._subscription
      .getRevenueChart()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this._toaster.success(res.message);
            this.monthlySubscription = res.revenue;
            this.totalPayment = res.totalAmount;
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
  downloadExcelReport(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      this._toaster.error('Please select both start and end dates.');
      return;
    }
  
    this._channelService.exceldata(startDate, endDate)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const excelBuffer = new Uint8Array(arrayBuffer);
            const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blobData, 'RevenueReport.xlsx');
          };
          reader.readAsArrayBuffer(blob);
        },
        error: (err) => {
          if (err && err.error && err.error.message) {
            this._toaster.error(err.error.message);
          } else {
            this._toaster.error('An error occurred while downloading the Excel report.');
            console.error('Error in downloading Excel report:', err);
          }
        },
      });
  }
  
  formatDataForExcel(revenue: any) {
    const data = [];
    for (const [key, value] of Object.entries(revenue)) {
      data.push({ Month: key, Revenue: value });
    }
    return data;
  }
  

}
