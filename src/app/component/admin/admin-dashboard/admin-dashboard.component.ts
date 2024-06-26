import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardmanageService } from '../../../service/admin/dashboardmanage.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OverallData } from '../../../model/auth';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  data: any;
  options: any;
  usersCount!: number;
  channelCount!: number;  
  monthlySubscription: { [key: string]: number } = {};
  overallData!:OverallData
  private readonly _destroy$ = new Subject<void>();
  constructor(
    private _dashService: DashboardmanageService,
    private _toaster: ToastrService
  ) {}

  ngOnInit() {
    this._dashService
      .getUsersCount()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message && res.userCount) {
            this.usersCount = res.userCount;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });

    this._dashService
      .getChannelCount()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message && res.channelCount) {
            this.channelCount = res.channelCount;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });

    this._dashService
      .getDashboardData()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this.monthlySubscription=res.monthlySubscription
            this.getDashboardData()
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

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4,
        },
      ],
    };

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
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  getDashboardData(){
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
  

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
