import { NgModule } from "@angular/core";

import { ModalComponent } from "./modal.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { SharedModule } from "src/app/_common";

@NgModule({
    imports: [SharedModule,NgZorroAntdModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
})
export class ModalModule { };