import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SagaToolsRoutingModule } from './saga-tools-routing.module';
import { SagaToolsComponent } from './saga-tools.component';

@NgModule({
  imports: [
    CommonModule,
    SagaToolsRoutingModule
  ],
  declarations: [SagaToolsComponent]
})
export class SagaToolsModule { }
