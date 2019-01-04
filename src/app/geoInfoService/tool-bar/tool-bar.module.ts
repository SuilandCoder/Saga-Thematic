import { NgModule } from "@angular/core";
import { AddLayerComponent } from "../add-layer/add-layer.component";
import { SelectComponent } from "../select/select.component";
import { FullExtentComponent } from "../full-extent/full-extent.component";
import { IdentifyComponent } from "../identify/identify.component";
import { ToolsBoxComponent } from "../tools-box/tools-box.component";
import { ToolsBoxSettingComponent } from "../tools-box-setting/tools-box-setting.component";
import { OnlineMapToolComponent } from "../online-map-tool/online-map-tool.component";
import { ToolPanelComponent } from "../tool-panel/tool-panel.component";
import { ToolsBoxSettingPanelComponent } from "../tools-box-setting-panel/tools-box-setting-panel.component";
import { TreeModule } from "ng2-tree";
import { SharedModule } from "../../_common";
 import { NgxUploaderModule } from 'ngx-uploader';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ToolBarComponent } from "./tool-bar.component";
import { ToolsBoxModule } from "../tools-box-new/tools-box.module"; 

@NgModule({
    imports:[
        SharedModule, //一开始以为在上层引用会传递下来,并不会
        TreeModule,
        NgxUploaderModule,
        NgZorroAntdModule.forRoot(),
        ToolsBoxModule],
    declarations: [
        ToolBarComponent,
        AddLayerComponent,
        SelectComponent,
        FullExtentComponent,
        IdentifyComponent,
        ToolsBoxComponent,
        ToolPanelComponent,
        ToolsBoxSettingComponent,
        ToolsBoxSettingPanelComponent,
        OnlineMapToolComponent
    ],exports:[
        ToolBarComponent
    ]
})
export class ToolBarModule { }