import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, channelGuard } from '../../auth/auth-guard.guard';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';



const routes: Routes = [
    
 { path: 'userhome', component: UserhomeComponent,canActivate:[authGuard] },
 { path: 'channel', component: ChannelOverviewComponent, canActivate: [channelGuard] },
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class UserSideRoutingModule { }
