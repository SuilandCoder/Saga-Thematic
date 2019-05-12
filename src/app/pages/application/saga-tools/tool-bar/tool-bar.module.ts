import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from "@angular/core";
import { TreeModule } from "ng2-tree";
import { SharedModule } from "src/app/_common";
import { NgxUploaderModule } from 'ngx-uploader';
import { ToolBarComponent } from "./tool-bar.component";
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { AddLayerComponent } from './add-layer/add-layer.component';
import { SelectComponent } from './select/select.component';
import { FullExtentComponent } from './full-extent/full-extent.component';
import { IdentifyComponent } from './identify/identify.component';
import { OnlineMapToolComponent } from './online-map-tool/online-map-tool.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import {
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatRippleModule,
} from '@angular/material';
import { SagaInfoComponent } from './saga-info/saga-info.component';

@NgModule({
    imports: [
        SharedModule, //一开始以为在上层引用会传递下来,并不会
        OverlayModule,
        CdkTreeModule,
        TreeModule,
        NgxUploaderModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatRippleModule,
    ],
    declarations: [
        ToolBarComponent,
        AddLayerComponent,
        SelectComponent,
        FullExtentComponent,
        IdentifyComponent,
        OnlineMapToolComponent,
        UserMenuComponent,
        SagaInfoComponent
    ], exports: [
        ToolBarComponent
    ],
    providers: [
        Overlay
    ]
})
export class ToolBarModule { }