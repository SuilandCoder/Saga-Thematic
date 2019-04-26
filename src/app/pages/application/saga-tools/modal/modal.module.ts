import { NgModule } from "@angular/core";

import { ModalComponent } from "./modal.component";
import { SharedModule } from "src/app/_common";

@NgModule({
    imports: [SharedModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
})
export class ModalModule { };