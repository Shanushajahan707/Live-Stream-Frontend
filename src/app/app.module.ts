import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { HeaderComponent } from './component/landing/header/header.component';
import { userReducer } from './store/userlogin/login-reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/userlogin/login-effects';
import { DialogModule } from 'primeng/dialog';
import { ForgotPasswordComponent } from './component/account/forgot-password/forgot-password.component';
import { BlockedAccountComponent } from './component/account/blocked-account/blocked-account.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NotFoundComponent } from './component/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForgotPasswordComponent,
    BlockedAccountComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    UserModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    ToastrModule.forRoot(),
    StoreModule.forRoot({}, {}),
    StoreModule.forRoot({
      user: userReducer,
    }),
    EffectsModule.forRoot([AuthEffects]),
    DialogModule,
    FormsModule,
    PickerModule, 
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
