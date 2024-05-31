import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ChannelService } from '../../../service/channel.service';
import { ChannelData } from '../../../model/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
  private _onLoadChannelInfoSubscription!: Subscription;
  private _onUpdateChannelSubscription!: Subscription;
  private _onUploadShortsSubscription!: Subscription;
  previewImage: string | null = null;
  channel!: ChannelData;
  visible: boolean = false;
  channelForm!: FormGroup;
  banner!: File;
  selectedContent: string = 'shorts';
  responsiveOptions: any[] | undefined;
  isModalVisible = false;
  filePreview: string | ArrayBuffer | null = null;
  isLoading = false;
  videoFile!: File;

  ngOnInit(): void {
    this._onLoadChannelInfoSubscription = this._service
      .onLoadChannelInfo()
      .subscribe({
        next: (res) => {
          console.log('channeldata is', res.channeldata);
          this._toaster.show(res.message);
          this.channel = res.channeldata;
          console.log('res form the channel is', res);
        },
        error: (error) => {
          console.log('error', error);
        },
      });

    this.channelForm = this._fb.group({
      channelName: ['', Validators.required],
    });

    this.responsiveOptions = [
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
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
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
      this.banner = target.files[0];
      const file = target.files[0];
      this.previewImage = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.channelForm) {
      this.visible = false;
      const formData: FormData = new FormData();
      formData.append('channelName', this.channelForm.value.channelName);

      // formData.append('banner', this.channelForm.value.banner);
      console.log('this banner is', this.banner);
      formData.append('banner', this.banner);
      console.log('data is ', formData.get('banner'));
      this._onUpdateChannelSubscription = this._service
        .onUpdateChannel(formData)
        .subscribe({
          next: (res) => {
            if (res && res.message) {
              this._toaster.success(res.message);
            }
            console.log('updated info', res);
            this.channel = res.newChannelData;
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
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  onFileSelected(event: any) {
    this.videoFile = event.target.files[0];
    if (this.videoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.videoFile);
    }
  }

  submitFile() {
    this.sentShort();
  }

  sentShort() {
    this.isLoading = true;
    const fomData = new FormData();
    fomData.append('videoFile', this.videoFile);
    console.log('formdata', fomData.get('videoFile'));

    this._onUploadShortsSubscription = this._service
      .onUploadShorts(fomData, this.channel._id)
      .subscribe({
        next: (res) => {
          console.log('Response:', res);
          if (res && res.message) {
            this._toaster.success(res.message);
            this.channel = res.uploadOnDp;
            console.log('channle', res.uploadOnDp);
            this.isLoading = false;
            this.hideModal();
          }
        },
        error: (err) => {
          console.error('Error:', err);
          if (err && err.error && err.error.message) {
            this._toaster.error(err.error.message);
          }
          this.isLoading = false;
          this.hideModal();
        },
      });
  }
  ngOnDestroy(): void {
    this._onLoadChannelInfoSubscription?.unsubscribe();
    this._onUpdateChannelSubscription?.unsubscribe();
    this._onUploadShortsSubscription?.unsubscribe();
  }
}
