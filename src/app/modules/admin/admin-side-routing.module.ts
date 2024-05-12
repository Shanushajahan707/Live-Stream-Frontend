import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../component/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsermanageComponent } from '../../component/admin/admin-usermanage/admin-usermanage.component';
import { AdminChannelmanageComponent } from '../../component/admin/admin-channelmanage/admin-channelmanage.component';

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
