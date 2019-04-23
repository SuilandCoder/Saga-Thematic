import { MainPageComponent } from './application/saga-tools/main-page/main-page.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ThemeInfoComponent } from './theme-info/theme-info.component';
import { ModelsInfoComponent } from './models-info/models-info.component';
import { ApplicationComponent } from './application/application.component';

const routes: Routes = [{
  path: '',
  component: MainPageComponent,
  children: [
    { path: '', redirectTo: 'saga-tools', pathMatch: 'full',},
    { path: 'saga-tools', component: MainPageComponent},
    { path: 'theme-info', component: ThemeInfoComponent },
    { path: 'models-info/:path', component: ModelsInfoComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
