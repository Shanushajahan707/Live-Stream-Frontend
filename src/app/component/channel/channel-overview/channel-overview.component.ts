import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChannelService } from '../../../service/channel.service';
import { ChannelData } from '../../../model/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-channel-overview',
  templateUrl: './channel-overview.component.html',
  styleUrl: './channel-overview.component.scss',
})
export class ChannelOverviewComponent implements OnInit {
  constructor(
    private _service: ChannelService,
    private _fb: FormBuilder,
    private _toaster: ToastrService
  ) {}
  @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;
  previewImage: string | null = null; // Add this line

  channel: ChannelData | null = null;
  visible: boolean = false;
  channelForm!: FormGroup;
  banner!: File;

  ngOnInit(): void {
    this._service.onLoadChannelInfo().subscribe({
      next: (res) => {
        console.log('channeldata is', res.channeldata);

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
      this._service.onUpdateChannel(formData).subscribe({
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
}
