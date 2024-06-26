import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth-guard.guard';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';
import { LiveComponent } from '../../component/userhomw/live/live.component';
import { FollowedChannelComponent } from '../../component/channel/followed-channel/followed-channel.component';
import { ViewChannelComponent } from '../../component/channel/view-channel/view-channel.component';
import { SubscriptionComponent } from '../../component/subscription/subscription/subscription.component';
import { ViewsubscriptionplanComponent } from '../../component/subscription/viewsubscriptionplan/viewsubscriptionplan.component';
import { WebsitesubscriptionviewComponent } from '../../component/userhomw/websitesubscriptionview/websitesubscriptionview.component';
import { SubscribedmembersComponent } from '../../component/subscription/subscribedmembers/subscribedmembers.component';
import { subscriptionGuard } from '../../auth/subscription.guard';
import { RevenuechartComponent } from '../../component/subscription/revenuechart/revenuechart.component';

const routes: Routes = [
  { path: 'userhome', component: UserhomeComponent, canActivate: [authGuard] },
  {
    path: 'channel',
    canActivateChild: [authGuard],
    children: [
      { path: 'mychannel', component: ChannelOverviewComponent },
      { path: 'following', component: FollowedChannelComponent },
      { path: 'following/:id', component: ViewChannelComponent },
    ],
  },
  { path: 'live', component: LiveComponent, canActivate: [authGuard] },
  {
    path: 'subscriptionplan',
    component: WebsitesubscriptionviewComponent,
    canActivate: [authGuard],
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'view', component: ViewsubscriptionplanComponent },
      { path: 'members', component: SubscribedmembersComponent },
      { path: 'revenuechart', component: RevenuechartComponent },
      { path: '', redirectTo: 'view', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/userhome', pathMatch: 'full' },
  { path: '**', redirectTo: '/userhome' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSideRoutingModule {}
