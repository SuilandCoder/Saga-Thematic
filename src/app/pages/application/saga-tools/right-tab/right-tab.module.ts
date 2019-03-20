import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RightTabComponent } from './right-tab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolSettingComponent } from './tool-setting/tool-setting.component';
import { SingleInputComponent } from './single-input/single-input.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ListInputComponent, ListInputDialog } from './list-input/list-input.component'; 
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DataListComponent } from 'src/app/shared/data-list/data-list.component';
import { DataPickComponent } from 'src/app/shared/data-pick/data-pick.component';
import { MatIconModule, MatMenuModule } from '@angular/material';
import {MatInputModule} from '@angular/material/input';
@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    CdkTreeModule,
    NgZorroAntdModule,
    NgxUploaderModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule, 
    MatMenuModule,
    FormsModule,
    MatInputModule,
  ],
  declarations: [
    RightTabComponent,
    ToolSettingComponent,
    SingleInputComponent,
    ListInputComponent,
    ListInputDialog,
    DataListComponent,
    DataPickComponent,
  ],
  entryComponents:[
    ListInputDialog,
    DataPickComponent,
  ],
  exports:[
    RightTabComponent
  ],
  providers:[
    Overlay
  ]
})
export class RightTabModule { }
