import { Component, OnInit, Input } from '@angular/core';
import {
  LayerItem,
  LayerItemInfo,
  OlMapService,
  UtilService
} from '../../_common';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {

  private CurrentLayersItem: LayerItem;
  LayerInfoArray: Array<LayerItemInfo>;

  @Input("LayerItem")
  set setLayerItem(layerItem: LayerItem) {
    this.CurrentLayersItem = layerItem;
    this.showInfo();

  }
  constructor(private olMapService: OlMapService,
    private utilService: UtilService) {
    this.LayerInfoArray = new Array<LayerItemInfo>();
  }

  ngOnInit() {


  }

  showInfo() {

    this.LayerInfoArray.splice(0, this.LayerInfoArray.length);
    if (this.CurrentLayersItem) {
      let LayerItemOnMap = this.olMapService.getLayerById(this.CurrentLayersItem.dataId);
      //name
      this.LayerInfoArray.push(new LayerItemInfo("Name", this.CurrentLayersItem.name));
      //state
      if (!this.CurrentLayersItem.uploaded) {
        this.LayerInfoArray.push(new LayerItemInfo("State", "Local"));
      } else {
        this.LayerInfoArray.push(new LayerItemInfo("State", "Remote"));
      }
      //type
      let LayerOnMap = this.olMapService.getLayerById(this.CurrentLayersItem.dataId);
      switch (this.CurrentLayersItem.type) {
        case "shp":
          this.LayerInfoArray.push(new LayerItemInfo("Type", "Vector"));
          let GeometryType = this.utilService.getGeometryType(LayerOnMap);
          if (GeometryType !== "") {
            this.LayerInfoArray.push(new LayerItemInfo("Geometry Type", GeometryType));
          } else {
            this.LayerInfoArray.push(new LayerItemInfo("Geometry Type", "Unknown"));
          }

          break;
        case "tif":
          this.LayerInfoArray.push(new LayerItemInfo("Type", "Tif"));
          break;
        default:
          this.LayerInfoArray.push(new LayerItemInfo("Type", "Unknown"));
          break;

      }

      this.LayerInfoArray.push(new LayerItemInfo("Proj", LayerOnMap.proj.name));
    }
  }

}
