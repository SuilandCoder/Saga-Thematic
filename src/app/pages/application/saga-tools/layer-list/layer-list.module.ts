import { NgModule } from "@angular/core";
import { LayerListComponent } from "./layer-list.component";
import { PopupComponent } from "../popup/popup.component";
import { ExportDataComponent } from "../export-data/export-data.component";
import { SortablejsModule } from 'angular-sortablejs/dist';
import { SharedModule } from "src/app/_common";
import { LayerSettingsModule } from "../layer-settings/layer-settings.module";
import { AttrbutesTableModule } from "../attributes-table/attributes-table.module";
@NgModule({
    imports: [
        SharedModule,
        SortablejsModule,
        LayerSettingsModule,
        AttrbutesTableModule],
    declarations: [
        LayerListComponent,
        PopupComponent,
        ExportDataComponent,
    ],
    exports:[
        LayerListComponent
    ]
})
export class LayerListModule { }