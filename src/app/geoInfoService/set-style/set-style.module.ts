import { NgModule } from "@angular/core";
import { SharedModule } from "../../_common";
import { SetStyleComponent } from "./set-style.component";
import { ColorBandComponent } from "../color-band/color-band.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgZorroAntdModule } from "ng-zorro-antd";
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
    exports:[SetStyleComponent]
})
export class SetStyleModule { };