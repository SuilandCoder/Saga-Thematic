import { ColorPickerModule } from 'ngx-color-picker';
import { NgModule } from '@angular/core';
import { SharedModule, UpperCaseFirst } from 'src/app/_common';
import { SetLabelsComponent } from './set-labels.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
    imports: [
        SharedModule,
        ColorPickerModule,
        NgZorroAntdModule
    ],
    declarations: [
        SetLabelsComponent,
        UpperCaseFirst
    ],exports:[
        SetLabelsComponent
    ] 
})
export class SetLabelsModule { };