import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataTransmissionService } from './../../_common/services/data-transmission.service';
import { HttpService } from './../../_common/services/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RightTabComponent } from './right-tab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolSettingComponent } from './tool-setting/tool-setting.component';
import { SingleInputComponent } from './single-input/single-input.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ListInputComponent, ListInputDialog } from './list-input/list-input.component'; 
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    CdkTreeModule,
    NgZorroAntdModule,
    NgxUploaderModule,
    MatDialogModule,
    MatButtonModule,
    
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
  ],
  providers:[
    Overlay
  ]
})
export class RightTabModule { }
