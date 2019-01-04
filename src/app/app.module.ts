import { ToastrModule } from 'ngx-toastr';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { AppComponent } from './app.component'; 
import { SharedModule } from './_common/shared.module';
import { DataModule } from './@core/data/data.module'
import { RouterModule,Routes} from '@angular/router' 
import { HttpClientModule } from '@angular/common/http'; 
import { httpInterceptorProviders } from './@core/utils/interceptor';
import { MainPageModule } from './geoInfoService/main-page/main-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { PagesModule } from './pages/pages.module';
const routes: Routes = [ 
  { path: '', loadChildren: './pages/pages.module#PagesModule' }, 
  { path:'saga-tools',loadChildren:'./geoInfoService/main-page/main-page.module#MainPageModule'}
]; 
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    BrowserModule, 
    HttpClientModule, 
    DataModule,
    MainPageModule,
    MatDialogModule,
    PagesModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
