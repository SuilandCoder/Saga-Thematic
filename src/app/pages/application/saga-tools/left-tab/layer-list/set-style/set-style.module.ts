import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common";
import { SetStyleComponent } from "./set-style.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorBandComponent } from "./color-band/color-band.component";
import {MatSliderModule} from '@angular/material/slider';
@NgModule({
    imports: [
        SharedModule,
        ColorPickerModule,
        MatSliderModule
    ],
    declarations: [
        SetStyleComponent,
        ColorBandComponent
    ],
    exports:[SetStyleComponent], 
})
export class SetStyleModule { };