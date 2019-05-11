import { FileSizePipe } from './pipes/filesize.pipe';
import { NgModule } from '@angular/core';

import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { WindowMouseMoveDirective, DialogDragDirective, MapResizeDirective } from './attribute-directives/react-directive';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { DataListComponent } from './shared/data-list/data-list.component';
import { DataPickComponent } from './shared/data-pick/data-pick.component';
import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatMenuModule,MatInputModule,MatDialogModule, MatPaginatorModule, MatProgressBarModule, MatTabsModule } from '@angular/material';
import { NgxUploaderModule } from 'ngx-uploader';
import { UploadListComponent } from './shared/upload-list/upload-list.component';
import { ToolDialogComponent } from './shared/tool-dialog/tool-dialog.component';
import { ToolSettingComponent } from './shared/tool-setting/tool-setting.component';
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
        MatTabsModule
    ],
    declarations: [
        WindowMouseMoveDirective,
        DialogDragDirective,
        MapResizeDirective,
        DataListComponent,
        DataPickComponent,
        UploadListComponent,
        FileSizePipe,
        ToolDialogComponent,
        ToolSettingComponent
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
        DataListComponent,
        DataPickComponent,
        UploadListComponent,
        ToolDialogComponent
    ],
    providers:[
        Overlay,
    ]
})

export class SharedModule {}