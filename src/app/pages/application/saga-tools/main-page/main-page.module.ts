import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkTreeModule } from '@angular/cdk/tree';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
 import { OlMapComponent } from './../ol-map/ol-map.component';
import { RightTabModule } from './../right-tab/right-tab.module'; 
import {API} from "src/config";
import { NgModule } from '@angular/core';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';

import { SharedModule, ImageProcessing,DataTransmissionService, GlobeConfigService, HttpService, ModelService, OlMapService, ToolsTreeService, UtilService, WindowEventService } from 'src/app/_common';
import { ToolBarModule } from '../tool-bar/tool-bar.module';
import { LeftTabModule } from '../left-tab/left-tab.module';
import { FooterModule } from '../footer/footer.module'; 
import { SidebarModule } from 'ng-sidebar';
import { OlMapModule } from '../ol-map/ol-map.module';
import { HttpClientModule } from '@angular/common/http';
import { ToolService } from 'src/app/_common/services/tool.service';
import { MenuService } from 'src/app/_common/services/menu.service';
import { MessageService } from 'src/app/_common/services/message.service';
import { RequestCache, RequestCacheWithMap } from 'src/app/_common/services'; 
import { RightBarComponent } from '../right-bar/right-bar.component';

@NgModule({
    imports: [
        SharedModule,
        OverlayModule,
        CdkTreeModule,
        MainPageRoutingModule,
        ToolBarModule,
        LeftTabModule,
        FooterModule,
        RightTabModule,
        MatSidenavModule,
        OlMapModule,
        HttpClientModule,  
        SidebarModule.forRoot(),
    ],
    declarations: [
        MainPageComponent,
        RightBarComponent,
    ],
    entryComponents:[
        OlMapComponent,
    ],
    providers: [
        DataTransmissionService,
        GlobeConfigService,
        HttpService,
        ModelService,
        ToolService,
        OlMapService,
        ToolsTreeService,
        UtilService,
        WindowEventService,
        ImageProcessing,
        MenuService,
        MessageService, 
        { provide: RequestCache, useClass: RequestCacheWithMap },
        Overlay,
        {
            provide: 'API',
            useValue: API
        }
    ],
    exports:[
        OverlayModule
    ]
    
})

export class MainPageModule {
    constructor() {
    }
    
}