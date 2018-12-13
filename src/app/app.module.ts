import { PagesComponent } from './pages/pages.component';
import { PagesModule } from './pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { AppComponent } from './app.component'; 
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
} from '@angular/material';
import { MatTreeModule } from '@angular/material/tree';
import { DataModule } from './@core/data/data.module'
import { RouterModule,Routes} from '@angular/router' 
import { HttpClientModule } from '@angular/common/http'; 
import { httpInterceptorProviders } from './@core/utils/interceptor';
const routes: Routes = [ 
  { path: '', loadChildren: 'app/pages/pages.module#PagesModule' },
]; 
@NgModule({
  declarations: [
    AppComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    PagesModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTreeModule, 
    DataModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
