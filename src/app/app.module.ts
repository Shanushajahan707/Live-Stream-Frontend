import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [AppComponent, HeaderComponent],
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
      auth: userReducer,
    }),
    EffectsModule.forRoot([AuthEffects]),
    DialogModule,
    FormsModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
