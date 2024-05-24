import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, channelGuard } from '../../auth/auth-guard.guard';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';
import { LiveComponent } from '../../component/userhomw/live/live.component';



const routes: Routes = [
    
 { path: 'userhome', component: UserhomeComponent,canActivate:[authGuard] },
 { path: 'channel', component: ChannelOverviewComponent, canActivate: [channelGuard] },
 { path: 'live', component: LiveComponent, canActivate: [channelGuard] },
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class UserSideRoutingModule { }
