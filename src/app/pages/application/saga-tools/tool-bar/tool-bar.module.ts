import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from "@angular/core";
import { AddLayerComponent } from "../add-layer/add-layer.component";
import { SelectComponent } from "../select/select.component";
import { FullExtentComponent } from "../full-extent/full-extent.component";
import { IdentifyComponent } from "../identify/identify.component";
import { OnlineMapToolComponent } from "../online-map-tool/online-map-tool.component";
import { TreeModule } from "ng2-tree";
import { SharedModule } from "src/app/_common";
 import { NgxUploaderModule } from 'ngx-uploader';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ToolBarComponent } from "./tool-bar.component"; 
import { OverlayModule, Overlay } from '@angular/cdk/overlay';

@NgModule({
    imports:[
        SharedModule, //一开始以为在上层引用会传递下来,并不会
        OverlayModule,
        CdkTreeModule,
        TreeModule,
        NgxUploaderModule,
        NgZorroAntdModule.forRoot(),
    ],
    declarations: [
        ToolBarComponent,
        AddLayerComponent,
        SelectComponent,
        FullExtentComponent,
        IdentifyComponent,
        OnlineMapToolComponent
    ],exports:[
        ToolBarComponent
    ],
    providers:[
        Overlay
    ]
})
export class ToolBarModule { }