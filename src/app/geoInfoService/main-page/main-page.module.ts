import { RightTabModule } from './../right-tab/right-tab.module';
import { RightTabComponent } from './../right-tab/right-tab.component';

import { NgModule } from '@angular/core';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';

import { SharedModule, DataTransmissionService, GlobeConfigService, HttpService, ModelService, OlMapService, ToosTreeService, UtilService, WindowEventService } from '../../_common';
import { ToolBarModule } from '../tool-bar/tool-bar.module';
import { LeftTabModule } from '../left-tab/left-tab.module';
import { OlMapModule } from '../ol-map/ol-map.module';
import { FooterModule } from '../footer/footer.module';
@NgModule({
    imports: [
        SharedModule,
        MainPageRoutingModule,
        ToolBarModule,
        LeftTabModule,
        OlMapModule,
        FooterModule,
        RightTabModule
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
    ],
    declarations: [
        MainPageComponent,
    ]
})

export class MainPageModule {
    constructor() {
    }
    
}