import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { WindowMouseMoveDirective, DialogDragDirective, MapResizeDirective } from './attribute-directives/react-directive';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        OverlayModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [
        WindowMouseMoveDirective,
        DialogDragDirective,
        MapResizeDirective,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        WindowMouseMoveDirective,
        DialogDragDirective,
        MapResizeDirective,
        NgZorroAntdModule
    ],
    providers:[
        Overlay
    ]
})

export class SharedModule { 
   
}