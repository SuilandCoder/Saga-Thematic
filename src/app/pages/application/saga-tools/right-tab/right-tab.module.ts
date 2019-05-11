import { UploadListComponent } from './../../../../_common/shared/upload-list/upload-list.component';
import { MainPageModule } from './../main-page/main-page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { RightTabComponent } from './right-tab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ToolSettingComponent } from './tool-setting/tool-setting.component';
import { SingleInputComponent } from './single-input/single-input.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ListInputComponent, ListInputDialog } from './list-input/list-input.component'; 
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule, MatMenuModule } from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import { SharedModule } from 'src/app/_common';
import { DataPickComponent } from 'src/app/_common/shared/data-pick/data-pick.component';
import { RightBarComponent } from '../right-bar/right-bar.component';
import {MatTabsModule} from '@angular/material/tabs';
@NgModule({
  imports: [
    SharedModule,
    CdkTreeModule,
    ReactiveFormsModule,
    NgxUploaderModule,
    MatDialogModule, 
    FormsModule,
    MatTabsModule
  ],
  declarations: [
    RightTabComponent,
    // ToolSettingComponent,
    SingleInputComponent,
    ListInputComponent,
    ListInputDialog,
  ],
  entryComponents:[
    ListInputDialog,
    DataPickComponent,
    UploadListComponent,
  ],
  exports:[
    RightTabComponent,
    // ToolSettingComponent
  ],
  providers:[
    Overlay
  ]
})
export class RightTabModule { }
