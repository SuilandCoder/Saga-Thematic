import { ModelsInfoComponent } from './pages/models-info/models-info.component';
import { ApplicationComponent } from './pages/application/application.component';
import { MainPageComponent } from './pages/application/saga-tools/main-page/main-page.component';
import { MatDialogModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './_common/shared.module';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './_common/interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { MainPageModule } from './pages/application/saga-tools/main-page/main-page.module';
import { SimpleReuseStrategy } from './_common/strategy/simple-reuse-strategy';
const routes: Routes = [
  // { path: '', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'saga-tools', loadChildren: './pages/application/saga-tools/main-page/main-page.module#MainPageModule' },
  { path: 'user', loadChildren: './pages/users/users.module#UsersModule' },
  { path: "", redirectTo: "saga-tools", pathMatch: 'full' }
]; 
@NgModule({
  declarations: [
    AppComponent,
    ApplicationComponent,
  ],
  imports: [
    SharedModule,
    OverlayModule,
    CdkTreeModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    MainPageModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [
    Overlay,
    httpInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy},
  ],
  exports: [
    OverlayModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }