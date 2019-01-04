import { NgModule } from "@angular/core";
import { SharedModule, ModalModule } from "../../_common";
import { ToolsBoxNewComponent } from "./tools-box-new.component";
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
    imports: [
        SharedModule,
        NgZorroAntdModule,
        ModalModule
    ],
    declarations: [ToolsBoxNewComponent],
    exports: [ToolsBoxNewComponent]
})
export class ToolsBoxModule { }