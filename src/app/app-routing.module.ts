import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/account/login/login.component';
import { LandinghomeComponent } from './component/landinghome/landinghome.component';
import { SignupComponent } from './component/account/signup/signup.component';
import { OtpComponent } from './component/account/otp/otp.component';
import { UserhomeComponent } from './component/userhomw/userhome/userhomme.component';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { authGuard } from './auth/auth-guard.guard';
import { AdminUsermanageComponent } from './component/admin/admin-usermanage/admin-usermanage.component';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { adminAuthGuardGuard } from './auth/admin-auth-guard.guard';


const routes: Routes = [
  { path: '', component: LandinghomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent, },
  {
    path: 'otp-verification',
    component: OtpComponent,
    
  },
  { path: 'userhome', component: UserhomeComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    children: [
      {
        path: 'usermangement',
        component: AdminUsermanageComponent,
        canActivate:[adminAuthGuardGuard]
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate:[adminAuthGuardGuard]
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
