import { MatDialogModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';

import { ToolsBoxNewComponent } from './app/geo-info-service/tools-box-new/tools-box-new.component';
import { ToastrModule } from 'ngx-toastr';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './_common/shared.module';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './@core/utils/interceptor';
import { MainPageModule } from './geoInfoService/main-page/main-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { PagesModule } from './pages/pages.module';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
const routes: Routes = [
  { path: '', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'saga-tools', loadChildren: './geoInfoService/main-page/main-page.module#MainPageModule' }
];
@NgModule({
  declarations: [
    AppComponent,
    ToolsBoxNewComponent
  ],
  imports: [
    SharedModule,
    OverlayModule,
    CdkTreeModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MainPageModule,
    MatDialogModule,
    PagesModule,
    
    
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
