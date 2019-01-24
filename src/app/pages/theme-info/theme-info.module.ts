 import { NgModule } from '@angular/core';
import { ThemeInfoComponent } from './theme-info.component';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  imports: [
    OverlayModule
  ],
  declarations: [
    ThemeInfoComponent
  ],
})
export class ThemeInfoModule {
}
