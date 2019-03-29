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
import { MatIconModule, MatMenuModule } from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import { SharedModule } from 'src/app/_common';
import { DataPickComponent } from 'src/app/_common/shared/data-pick/data-pick.component';
@NgModule({
  imports: [
    SharedModule,
    CdkTreeModule,
    NgZorroAntdModule,
    NgxUploaderModule,
    MatDialogModule,
  ],
  declarations: [
    RightTabComponent,
    ToolSettingComponent,
    SingleInputComponent,
    ListInputComponent,
    ListInputDialog,
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
