import { FileSizePipe } from './pipes/filesize.pipe';
import { NgModule } from '@angular/core';

import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { WindowMouseMoveDirective, DialogDragDirective, MapResizeDirective } from './attribute-directives/react-directive';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { DataListComponent } from './shared/data-list/data-list.component';
import { DataPickComponent } from './shared/data-pick/data-pick.component';
import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatMenuModule,MatInputModule,MatDialogModule, MatPaginatorModule, MatProgressBarModule } from '@angular/material';
import { NgxUploaderModule } from 'ngx-uploader';
import { UploadListComponent } from './shared/upload-list/upload-list.component';
// import { SimpleReuseStrategy } from './strategy/simple-reuse-strategy';
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
        MatProgressBarModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [
        WindowMouseMoveDirective,
        DialogDragDirective,
        MapResizeDirective,
        DataListComponent,
        DataPickComponent,
        UploadListComponent,
        FileSizePipe,
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
        DataPickComponent,
        UploadListComponent,
    ],
    providers:[
        Overlay,
    ]
})

export class SharedModule {}