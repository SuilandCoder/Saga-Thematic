import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ModelsInfoComponent } from './models-info.component';
import { NgModule } from '@angular/core';
import { PhotoCardComponent } from './photo-card/photo-card.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    OverlayModule,
    MatCardModule,
    CommonModule,
   
  ],
  declarations: [
    ModelsInfoComponent,
    PhotoCardComponent
  ],
  entryComponents:[
    PhotoCardComponent
  ]
})
export class ModelsInfoModule {
}
