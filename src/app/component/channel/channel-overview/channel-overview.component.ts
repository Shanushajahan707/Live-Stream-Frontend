import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ChannelService } from '../../../service/user/channel/channel.service';
import { ChannelData } from '../../../model/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-channel-overview',
  templateUrl: './channel-overview.component.html',
  styleUrl: './channel-overview.component.scss',
})
export class ChannelOverviewComponent implements OnInit, OnDestroy {
  constructor(
    private _service: ChannelService,
    private _fb: FormBuilder,
    private _toaster: ToastrService
  ) {}

  @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;
  private readonly _destroy$ = new Subject<void>();
  _previewImage: string | null = null;
  _channel!: ChannelData;
  _visible: boolean = false;
  _channelForm!: FormGroup;
  _banner!: File;
  _selectedContent: string = 'shorts';
  _responsiveOptions: any[] | undefined;
  _isModalVisible = false;
  _filePreview: string | ArrayBuffer | null = null;
  _isLoading = false;
  _videoFile!: File;

  ngOnInit(): void {
    this._service
      .onLoadChannelInfo()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log('channeldata is', res.channeldata);
          this._toaster.show(res.message);
          this._channel = res.channeldata;
        },
        error: (error) => {
          console.log('error', error);
        },
      });

    this._channelForm = this._fb.group({
      channelName: ['', Validators.required],
    });

    this._responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  showDialog() {
    this._visible = true;
  }

  closeDialog() {
    this._visible = false;
  }
  // changeBanner(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     if (file.size <= 5 * 1024 * 1024) {
  //       this.banner = file;
  //     } else {
  //       console.error('File is too large. Please select a smaller file.');
  //     }
  //   }
  // }

  openFilePicker() {
    this.bannerInput.nativeElement.click();
  }
  changeBanner(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files?.length > 0) {
      this._banner = target.files[0];
      const file = target.files[0];
      this._previewImage = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this._channelForm) {
      this._visible = false;
      const formData: FormData = new FormData();
      formData.append('channelName', this._channelForm.value.channelName);

      // formData.append('banner', this.channelForm.value.banner);
      console.log('this banner is', this._banner);
      formData.append('banner', this._banner);
      console.log('data is ', formData.get('banner'));
      this._service
        .onUpdateChannel(formData)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
            }
            console.log('updated info', res);
            this._channel = res.newChannelData;
          },
          error: (err) => {
            if (err && err.error.message) {
              this._toaster.error(err.error.message);
            }
          },
        });
    }
  }
  showModal() {
    this._isModalVisible = true;
    console.log('modal');
  }

  hideModal() {
    this._isModalVisible = false;
  }

  onFileSelected(event: any) {
    this._videoFile = event.target.files[0];
    if (this._videoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this._filePreview = reader.result;
      };
      reader.readAsDataURL(this._videoFile);
    }
  }

  submitFile() {
    this.sentShort();
  }

  sentShort() {
    console.log('click');

    this._isLoading = true;
    const fomData = new FormData();
    fomData.append('videoFile', this._videoFile);
    console.log('formdata', fomData.get('videoFile'));

    this._service
      .onUploadShorts(fomData, this._channel._id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log('Response:', res);
          if (res && res.message) {
            this._toaster.success(res.message);
            this._channel = res.uploadOnDp;
            console.log('channle', res.uploadOnDp);
            this._isLoading = false;
            this.hideModal();
          }
        },
        error: (err) => {
          console.error('Error:', err);
          if (err && err.error && err.error.message) {
            this._toaster.error(err.error.message);
          }
          this._isLoading = false;
          this.hideModal();
        },
      });
  }

  onVideoPlay(videoItem: any) {
    console.log('played' + videoItem);
    const formdata = new FormData();
    formdata.append('videourl', videoItem);
    this._service
      .onUpdateViews(formdata, this._channel._id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._channel.video.forEach((video) => {
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
