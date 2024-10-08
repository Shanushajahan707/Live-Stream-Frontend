import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../component/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsermanageComponent } from '../../component/admin/admin-usermanage/admin-usermanage.component';
import { AdminChannelmanageComponent } from '../../component/admin/admin-channelmanage/admin-channelmanage.component';
import { AdminwebsitesubscriptionComponent } from '../../component/admin/adminwebsitesubscription/adminwebsitesubscription.component';
import { AdminchannelsubscriptionComponent } from '../../component/admin/adminchannelsubscription/adminchannelsubscription.component';
import { AdminMembershipComponent } from '../../component/admin/admin-membership/admin-membership.component';
import { adminAuthGuardGuard } from '../../auth/admin-auth-guard.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'usermangement',
    component: AdminUsermanageComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'channels',
    component: AdminChannelmanageComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'websitesubscription',
    component: AdminwebsitesubscriptionComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'channelsubscription',
    component: AdminchannelsubscriptionComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'websitemembership',
    component: AdminMembershipComponent,
    canActivate: [adminAuthGuardGuard]
  },
  {
    path: 'admin',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
