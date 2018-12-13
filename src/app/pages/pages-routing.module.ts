import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ThemeInfoComponent } from './theme-info/theme-info.component';
import { ModelsInfoComponent } from './models-info/models-info.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'theme-info', component: ThemeInfoComponent },
    {
      path: 'models-info/:path',
      component: ModelsInfoComponent,
    },
    {
      path: '',
      redirectTo: 'ThemeInfoComponent',
      pathMatch: 'full',
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
