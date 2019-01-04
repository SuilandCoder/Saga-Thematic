import { PagesComponent } from './pages.component';
import { ModelsInfoModule } from './models-info/models-info.module'; 
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core'; 
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
} from '@angular/material';
import { MatTreeModule } from '@angular/material/tree';
import { ThemeInfoComponent } from './theme-info/theme-info.component';
import { ApplicationComponent } from './application/application.component'; 

@NgModule({
  imports: [
    PagesRoutingModule,
    ModelsInfoModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTreeModule, 
  ],
  declarations: [
    PagesComponent,
    ThemeInfoComponent, 
  ApplicationComponent],
})
export class PagesModule {
}
