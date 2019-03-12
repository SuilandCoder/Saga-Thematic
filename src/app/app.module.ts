import { MatDialogModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './_common/shared.module';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './_common/interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { MainPageModule } from './pages/application/saga-tools/main-page/main-page.module';
const routes: Routes = [
  // { path: '', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'saga-tools', loadChildren: './pages/application/saga-tools/main-page/main-page.module#MainPageModule' },
  { path: 'users', loadChildren: './pages/users/users.module#UsersModule' }
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    OverlayModule,
    CdkTreeModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    PagesModule,
    MainPageModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [
    Overlay,
    httpInterceptorProviders,
  ],
  exports: [
    OverlayModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }