import { NgModule } from "@angular/core";
import { AttributesTableComponent } from "./attributes-table.component";
import { NgZorroAntdModule } from "ng-zorro-antd"; 
import { SharedModule } from "src/app/_common";
import { ModalModule } from "../../../modal";


@NgModule({
    imports: [
        SharedModule,
        NgZorroAntdModule,
        ModalModule
    ],
    declarations: [
        AttributesTableComponent,
    ],
    exports: [
        AttributesTableComponent
    ]
})
export class AttrbutesTableModule { };