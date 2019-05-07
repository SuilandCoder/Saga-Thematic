import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common";
import { LeftTabComponent } from "./left-tab.component";
import { TreeModule } from "ng2-tree"; 
import { Overlay,OverlayModule } from '@angular/cdk/overlay'; 
import { LayerListModule } from './layer-list/layer-list.module';
import { DataListComponent } from './data-list/data-list.component';
import { ToolListComponent } from './tool-list/tool-list.component';
import { MatMenuModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
@NgModule({
    imports: [
        SharedModule,
        OverlayModule,
        CdkTreeModule,
        LayerListModule,
        TreeModule,
        MatMenuModule,
        MatDialogModule, 
        MatTabsModule
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