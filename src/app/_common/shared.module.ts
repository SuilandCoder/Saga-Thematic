import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { WindowMouseMoveDirective, DialogDragDirective, MapResizeDirective } from './attribute-directives/react-directive';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { DataListComponent } from './shared/data-list/data-list.component';
import { DataPickComponent } from './shared/data-pick/data-pick.component';
import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatMenuModule,MatInputModule,MatDialogModule, MatPaginatorModule } from '@angular/material';
import { NgxUploaderModule } from 'ngx-uploader';
// import { DataPickComponent } from './shared/data-pick/data-pick.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        OverlayModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule, 
        MatMenuModule,
        MatInputModule,
        MatDialogModule,
        NgxUploaderModule,
        MatPaginatorModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [
        WindowMouseMoveDirective,
        DialogDragDirective,
        MapResizeDirective,
        DataListComponent,
        DataPickComponent
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
        NgZorroAntdModule,
        DataListComponent,
        DataPickComponent
    ],
    providers:[
        Overlay
    ]
})

export class SharedModule {}