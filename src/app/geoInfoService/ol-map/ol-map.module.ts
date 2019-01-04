import { NgModule } from "@angular/core";
import { SharedModule, ImageProcessing } from "../../_common";
import { OlMapComponent } from "./ol-map.component";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        OlMapComponent
    ],
    providers:[
        ImageProcessing
    ],
    exports: [
        OlMapComponent
    ]
})
export class OlMapModule { };