import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../../component/landing/chat/chat.component';
import { LoginComponent } from '../../component/account/login/login.component';
import { LandinghomeComponent } from '../../component/landinghome/landinghome.component';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';
import { RecommendationComponent } from '../../component/landing/recommendation/recommendation.component';
import { LivescreenComponent } from '../../component/landing/livescreen/livescreen.component';
import { SignupComponent } from '../../component/account/signup/signup.component';
import { OtpComponent } from '../../component/account/otp/otp.component';
import { RecommendlistComponent } from '../../component/userhomw/recommendlist/recommendlist.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserSideRoutingModule } from './user-side-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { LiveComponent } from '../../component/userhomw/live/live.component';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { FollowedChannelComponent } from '../../component/channel/followed-channel/followed-channel.component';
import { ViewChannelComponent } from '../../component/channel/view-channel/view-channel.component';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { ViewsubscriptionplanComponent } from '../../component/subscription/viewsubscriptionplan/viewsubscriptionplan.component';
import { SubscriptionsidebarComponent } from '../../component/subscription/subscriptionsidebar/subscriptionsidebar.component';
import { SubscriptionComponent } from '../../component/subscription/subscription/subscription.component';
import { WebsitesubscriptionviewComponent } from '../../component/userhomw/websitesubscriptionview/websitesubscriptionview.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { SubscribedmembersComponent } from '../../component/subscription/subscribedmembers/subscribedmembers.component';
import { RevenuechartComponent } from '../../component/subscription/revenuechart/revenuechart.component';
import { ChartModule } from 'primeng/chart';
@NgModule({
  declarations: [
    RecommendationComponent,
    ChatComponent,
    LivescreenComponent,
    LoginComponent,
    SignupComponent,
    LandinghomeComponent,
    OtpComponent,
    UserhomeComponent,
    RecommendlistComponent,
    ChannelOverviewComponent,
    LiveComponent,
    FollowedChannelComponent,
    ViewChannelComponent,
    ViewsubscriptionplanComponent,
    SubscriptionsidebarComponent,
    SubscriptionComponent,
    WebsitesubscriptionviewComponent,
    SubscribedmembersComponent,
    RevenuechartComponent

  ],
  imports: [
    UserSideRoutingModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FormsModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FileUploadModule,
    CarouselModule,
    TagModule,
    MessageModule,
    ProgressSpinnerModule,
    MenuModule,
    NgxPayPalModule,
    ChartModule
  ],
  exports: [
    TooltipModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
  ],
})
export class UserModule {}
