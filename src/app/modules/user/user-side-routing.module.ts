import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, channelGuard } from '../../auth/auth-guard.guard';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';
import { LiveComponent } from '../../component/userhomw/live/live.component';
import { FollowedChannelComponent } from '../../component/channel/followed-channel/followed-channel.component';
import { ViewChannelComponent } from '../../component/channel/view-channel/view-channel.component';

const routes: Routes = [
  { path: 'userhome', component: UserhomeComponent, canActivate: [authGuard] },
  {
    path: 'channel',
    canActivate: [channelGuard],
    children: [
      { path: 'mychannel', component: ChannelOverviewComponent },
      { path: 'following', component: FollowedChannelComponent },
      { path: 'following/:id', component: ViewChannelComponent },
    ],
  },
  { path: 'live', component: LiveComponent, canActivate: [channelGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSideRoutingModule {}
