import { ModelsInfoModule } from './models-info/models-info.module';
import { ThemeInfoModule } from './theme-info/theme-info.module';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core'; 
const PAGES_COMPONENTS = [
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeInfoModule,
    ModelsInfoModule
  ],
  declarations: [
  ],
})
export class PagesModule {
}
