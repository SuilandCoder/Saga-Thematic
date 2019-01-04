import { NgModule } from "@angular/core";
import { SharedModule } from "../shared.module";
import { ModalComponent } from "./modal.component";
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
    imports: [SharedModule,NgZorroAntdModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
})
export class ModalModule { };