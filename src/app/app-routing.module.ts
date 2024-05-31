import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard,authGuardForLoggedUsers } from './auth/auth-guard.guard';
import { adminAuthGuardGuard } from './auth/admin-auth-guard.guard';
import { LandinghomeComponent } from './component/landinghome/landinghome.component';
import { LoginComponent } from './component/account/login/login.component';
import { SignupComponent } from './component/account/signup/signup.component';
import { OtpComponent } from './component/account/otp/otp.component';
import { ForgotPasswordComponent } from './component/account/forgot-password/forgot-password.component';
import { BlockedAccountComponent } from './component/account/blocked-account/blocked-account.component';


const routes: Routes = [
  {
    path: '',
    component: LandinghomeComponent,
   canActivate:[authGuardForLoggedUsers],
 },
 {
    path: 'login',
    component: LoginComponent,
    canActivate:[authGuardForLoggedUsers]
 },
 {
    path: 'signup',
    component: SignupComponent,
    canActivate: [authGuardForLoggedUsers],
 },
 {
    path: 'otp-verification',
    component: OtpComponent,
    canActivate: [authGuardForLoggedUsers],
 },
 {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authGuardForLoggedUsers],
 },
 {
    path: 'blocked-account',
    component: BlockedAccountComponent,

 },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    canActivate:[authGuard]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivateChild:[adminAuthGuardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
