import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandinghomeComponent } from '../../component/landinghome/landinghome.component';
import { authGuard, authGuardForLoggedUsers, channelGuard } from '../../auth/auth-guard.guard';
import { LoginComponent } from '../../component/account/login/login.component';
import { SignupComponent } from '../../component/account/signup/signup.component';
import { OtpComponent } from '../../component/account/otp/otp.component';
import { UserhomeComponent } from '../../component/userhomw/userhome/userhomme.component';
import { ChannelOverviewComponent } from '../../component/channel/channel-overview/channel-overview.component';



const routes: Routes = [
    
 { path: 'userhome', component: UserhomeComponent, canActivate: [authGuard] },
 { path: 'channel', component: ChannelOverviewComponent, canActivate: [channelGuard] },
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class UserSideRoutingModule { }
