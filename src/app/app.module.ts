import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/landing/header/header.component';
import { RecommendationComponent } from './component/landing/recommendation/recommendation.component';
import { ChatComponent } from './component/landing/chat/chat.component';
import { LivescreenComponent } from './component/landing/livescreen/livescreen.component';
import { LoginComponent } from './component/account/login/login.component';
import { SignupComponent } from './component/account/signup/signup.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LandinghomeComponent } from './component/landinghome/landinghome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpComponent } from './component/account/otp/otp.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { UserhomeComponent } from './component/userhomw/userhome/userhomme.component';
import { RecommendlistComponent } from './component/userhomw/recommendlist/recommendlist.component';
import { AdminUsermanageComponent } from './component/admin/admin-usermanage/admin-usermanage.component';
import { AdminSidebarComponent } from './component/admin/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './component/admin/admin-header/admin-header.component';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecommendationComponent,
    ChatComponent,
    LivescreenComponent,
    LoginComponent,
    SignupComponent,
    LandinghomeComponent,
    OtpComponent,
    AdminHomeComponent,
    UserhomeComponent,
    RecommendlistComponent,
    AdminUsermanageComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    ToastrModule.forRoot(),
  ],
  providers: [provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
