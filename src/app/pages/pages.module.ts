import { CommonModule } from '@angular/common';
import { TreeModule } from 'ng2-tree';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { OverlayModule, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { PagesComponent } from './pages.component';
import { ModelsInfoModule } from './models-info/models-info.module';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core'; 
import { ThemeInfoComponent } from './theme-info/theme-info.component';
import { ApplicationComponent } from './application/application.component';
import { ThemeInfoModule } from './theme-info/theme-info.module';
import { Overlay } from 'ngx-toastr';
import { CdkTreeModule } from '@angular/cdk/tree';
import {MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    CdkTreeModule,
    PagesRoutingModule,
    ModelsInfoModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTreeModule,
    TreeModule,
    ThemeInfoModule
  ],
  declarations: [
    PagesComponent,
    ApplicationComponent
  ],
  entryComponents: [
    ThemeInfoComponent,
  ],
  providers: [
    Overlay 
  ],
  exports: [
    OverlayModule
  ]
})
export class PagesModule {
}
