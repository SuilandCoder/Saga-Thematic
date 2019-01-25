import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common";
import { LeftTabComponent } from "./left-tab.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TreeModule } from "ng2-tree"; 
import { Overlay,OverlayModule } from '@angular/cdk/overlay'; 
import { LayerListModule } from './layer-list/layer-list.module';
import { DataListComponent } from './data-list/data-list.component';
import { ToolListComponent } from './tool-list/tool-list.component';
@NgModule({
    imports: [
        SharedModule,
        OverlayModule,
        CdkTreeModule,
        NgZorroAntdModule,
        LayerListModule,
        TreeModule,
        MatDialogModule, 
    ],
    declarations: [
        LeftTabComponent,
        DataListComponent,
        ToolListComponent,
    ],
    exports: [
        LeftTabComponent,
        DataListComponent,
    ],
    providers:[
        Overlay
    ]
})
export class LeftTabModule { };