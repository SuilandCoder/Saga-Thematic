import { ToolsBoxNewComponent } from './tools-box-new.component';
import { NgModule } from "@angular/core";
import { SharedModule, ModalModule } from "../../_common"; 
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
    imports: [
        SharedModule,
        NgZorroAntdModule,
        ModalModule
    ],
    declarations: [ToolsBoxNewComponent],
    exports: [ToolsBoxNewComponent], 
})
export class ToolsBoxModule { } 