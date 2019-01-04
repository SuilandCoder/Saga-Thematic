import { NgModule } from "@angular/core";
import { SharedModule } from "../../_common";
import { FooterComponent } from "./footer.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ProjectionListComponent } from "../projection-list/projection-list.component";

@NgModule({
    imports: [
        SharedModule,
        NgZorroAntdModule
    ],
    declarations: [
        FooterComponent,
        ProjectionListComponent
    ],
    exports: [
        FooterComponent
    ]
})
export class FooterModule { };