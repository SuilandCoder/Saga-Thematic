import { OlMapComponent } from './../ol-map/ol-map.component';
import { RightTabModule } from './../right-tab/right-tab.module';
import { RightTabComponent } from './../right-tab/right-tab.component';

import { NgModule } from '@angular/core';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';

import { SharedModule, ImageProcessing,DataTransmissionService, GlobeConfigService, HttpService, ModelService, OlMapService, ToosTreeService, UtilService, WindowEventService } from '../../_common';
import { ToolBarModule } from '../tool-bar/tool-bar.module';
import { LeftTabModule } from '../left-tab/left-tab.module';
import { OlMapModule } from '../ol-map/ol-map.module';
import { FooterModule } from '../footer/footer.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
    imports: [
        SharedModule,
        MainPageRoutingModule,
        ToolBarModule,
        LeftTabModule,
        FooterModule,
        RightTabModule,
        MatSidenavModule,
        SidebarModule.forRoot()
    ],
    providers: [
        DataTransmissionService,
        GlobeConfigService,
        HttpService,
        ModelService,
        OlMapService,
        ToosTreeService,
        UtilService,
        WindowEventService,
        ImageProcessing
    ],
    declarations: [
        MainPageComponent,
        OlMapComponent,
    ]
})

export class MainPageModule {
    constructor() {
    }
    
}