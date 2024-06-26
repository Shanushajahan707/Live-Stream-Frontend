import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../component/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsermanageComponent } from '../../component/admin/admin-usermanage/admin-usermanage.component';
import { AdminChannelmanageComponent } from '../../component/admin/admin-channelmanage/admin-channelmanage.component';
import { AdminwebsitesubscriptionComponent } from '../../component/admin/adminwebsitesubscription/adminwebsitesubscription.component';
import { AdminchannelsubscriptionComponent } from '../../component/admin/adminchannelsubscription/adminchannelsubscription.component';
import { AdminMembershipComponent } from '../../component/admin/admin-membership/admin-membership.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'usermangement',
    component: AdminUsermanageComponent,
  },
  {
    path: 'channels',
    component: AdminChannelmanageComponent,
  },
  {
    path: 'websitesubscription',
    component: AdminwebsitesubscriptionComponent,
  },
  {
    path: 'channelsubscription',
    component: AdminchannelsubscriptionComponent,
  },
  {
    path: 'websitemembership',
    component: AdminMembershipComponent,
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
