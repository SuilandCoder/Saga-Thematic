import { ColorPickerModule } from 'ngx-color-picker';
import { NgModule } from '@angular/core';
import { SharedModule, UpperCaseFirst } from 'src/app/_common';
import { SetLabelsComponent } from './set-labels.component';

@NgModule({
    imports: [
        SharedModule,
        ColorPickerModule,
    ],
    declarations: [
        SetLabelsComponent,
        UpperCaseFirst
    ],exports:[
        SetLabelsComponent
    ] 
})
export class SetLabelsModule { };