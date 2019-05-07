import { NgModule } from "@angular/core";
import { AttributesTableComponent } from "./attributes-table.component";
import { SharedModule } from "src/app/_common";
import { ModalModule } from "../../../modal";
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        ModalModule,
        MatTableModule
    ],
    declarations: [
        AttributesTableComponent,
    ],
    exports: [
        AttributesTableComponent
    ]
})
export class AttrbutesTableModule { };