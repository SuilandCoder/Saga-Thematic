import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common";
import { SetStyleComponent } from "./set-style.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ColorBandComponent } from "./color-band/color-band.component";
@NgModule({
    imports: [
        SharedModule,
        NgZorroAntdModule,
        ColorPickerModule
    ],
    declarations: [
        SetStyleComponent,
        ColorBandComponent
    ],
    exports:[SetStyleComponent], 
})
export class SetStyleModule { };