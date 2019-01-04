import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SagaToolsComponent } from './saga-tools.component';

const routes: Routes = [
  {
    path: 'saga-tools',
    component: SagaToolsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SagaToolsRoutingModule { }
