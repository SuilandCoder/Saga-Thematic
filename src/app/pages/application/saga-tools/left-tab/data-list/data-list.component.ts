import { Component, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  LayerItem,
  DataItem,
  DataTransmissionService,
  WindowEventService,
  OlMapService
} from 'src/app/_common';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {
  ListItems: Array<LayerItem>;
  private SelectedListItemId: string;
  private ListHeight: number;
  private CurrentTabIndex: number;

  constructor(private dataTransmissionService: DataTransmissionService,
    private olMapService: OlMapService
  ) {
    this.ListItems = new Array<LayerItem>();
    this.CurrentTabIndex = 0;
  }


  ngOnInit() {

    this.ListHeight = window.innerHeight * 0.88;
    window.addEventListener('resize', () => {
      this.ListHeight = window.innerHeight * 0.88;
    })



    this.dataTransmissionService.getRemoteData().subscribe(data => {
      this.ListItems.push(new LayerItem(data.name, null, data.type, data.id));
    });

    this.dataTransmissionService.getOutputDataSubject().subscribe(data=>{
      let item = new LayerItem(data.dataName,null,data.type,data.dataId);
      this.ListItems.push(item);
    })

    this.dataTransmissionService.getTabIndexSwitchedSubject().subscribe(TabIndex => { 
      this.CurrentTabIndex = TabIndex;
    });
  }

  //以压缩包的形式下载
  onDownload(dataltem: LayerItem, ev: MouseEvent) {
    this.olMapService.downloadFile(dataltem, dataltem.name, new DataItem("ESRI_SHAPEFILE", "Esri Shapefile"));
    ev.stopPropagation();
  }

  onDataItemClick(DataItem: LayerItem) {
    this.SelectedListItemId = DataItem.dataId;
    this.dataTransmissionService.sendLayerSelectedSubject(this.SelectedListItemId);
  }

  //////////按键事件/////////
  @HostListener('document:keyup', ['$event'])
  onkeydown(event: KeyboardEvent) {
    if (this.CurrentTabIndex === 1) {
      if (event.keyCode === 46) {
        //删除选中的item
        if (this.SelectedListItemId) {
          let findedItem = this.ListItems.find((value) => value.dataId === this.SelectedListItemId);
          if (findedItem) {
            this.ListItems.splice(this.ListItems.indexOf(findedItem), 1);
            this.SelectedListItemId = null;
          }
        }
      }
    }
  }

}
