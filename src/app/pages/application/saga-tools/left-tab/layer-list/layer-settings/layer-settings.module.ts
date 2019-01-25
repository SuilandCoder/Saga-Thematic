import { NgModule } from "@angular/core";
import { LayerSettingsComponent } from "./layer-settings.component";
import { GeneralInfoComponent } from "../general-info/general-info.component";
import { SharedModule } from "src/app/_common";
import { SetStyleModule } from "../set-style/set-style.module";
import { SetLabelsModule } from "../set-labels/set-labels.module";

@NgModule({
    imports:[
        SharedModule,
        SetStyleModule,
        SetLabelsModule
    ],
    declarations:[
        LayerSettingsComponent,
        GeneralInfoComponent,
    ],
    exports:[
        LayerSettingsComponent
    ]
})
export class LayerSettingsModule{};