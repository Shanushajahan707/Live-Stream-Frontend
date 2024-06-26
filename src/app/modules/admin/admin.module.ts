import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from '../../component/admin/admin-home/admin-home.component';
import { AdminSidebarComponent } from '../../component/admin/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../../component/admin/admin-header/admin-header.component';
import { AdminUsermanageComponent } from '../../component/admin/admin-usermanage/admin-usermanage.component';
import { AdminDashboardComponent } from '../../component/admin/admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminChannelmanageComponent } from '../../component/admin/admin-channelmanage/admin-channelmanage.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { AdminRoutingModule } from './admin-side-routing.module';
import { ChartModule } from 'primeng/chart';
import { EmailpipePipe } from '../../pipe/emailpipe.pipe';
import { AdminwebsitesubscriptionComponent } from '../../component/admin/adminwebsitesubscription/adminwebsitesubscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminchannelsubscriptionComponent } from '../../component/admin/adminchannelsubscription/adminchannelsubscription.component';
import { AdminMembershipComponent } from '../../component/admin/admin-membership/admin-membership.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminUsermanageComponent,
    AdminDashboardComponent,
    AdminChannelmanageComponent,
    EmailpipePipe,
    AdminwebsitesubscriptionComponent,
    AdminchannelsubscriptionComponent,
    AdminMembershipComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SidebarModule,
    ChartModule,
    ReactiveFormsModule,
  ],
  exports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    SidebarModule,
    EmailpipePipe,
  ],
})
export class AdminModule {}
