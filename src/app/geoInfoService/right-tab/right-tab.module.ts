import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RightTabComponent } from './right-tab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolSettingComponent } from './tool-setting/tool-setting.component';
import { SingleInputComponent } from './single-input/single-input.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ListInputComponent, ListInputDialog } from './list-input/list-input.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NgxUploaderModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    RightTabComponent,
    ToolSettingComponent,
    SingleInputComponent,
    ListInputComponent,
    ListInputDialog
  ],
  entryComponents:[
    ListInputDialog
  ],
  exports:[
    RightTabComponent
  ]
})
export class RightTabModule { }
