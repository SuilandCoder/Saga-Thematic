import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common";
import { FooterComponent } from "./footer.component";
import { ProjectionListComponent } from "./projection-list/projection-list.component";

@NgModule({
    imports: [
        SharedModule,
        
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