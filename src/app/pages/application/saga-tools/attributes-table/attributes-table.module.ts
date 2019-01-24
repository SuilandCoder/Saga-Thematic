import { NgModule } from "@angular/core";
import { AttributesTableComponent } from "./attributes-table.component";
import { NgZorroAntdModule } from "ng-zorro-antd"; 
import { ModalModule } from "../modal";
import { SharedModule } from "src/app/_common";


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