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
@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminUsermanageComponent,
    AdminDashboardComponent,
    AdminChannelmanageComponent,
    EmailpipePipe,
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
