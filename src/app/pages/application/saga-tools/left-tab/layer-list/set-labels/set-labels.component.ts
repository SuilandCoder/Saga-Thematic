import { Component, OnInit, Input } from '@angular/core';
import {
  LayerSetting,
  LayerItem,
  TextStyle,
  UtilService,
  OlMapService
} from 'src/app/_common';


@Component({
  selector: 'app-set-labels',
  templateUrl: './set-labels.component.html',
  styleUrls: ['./set-labels.component.css'],
})
export class SetLabelsComponent implements OnInit {

  CurrentLayersItem: LayerItem;
  FieldArray: Array<string>;
  layerSetting: LayerSetting;
  layerSettingOnMap: LayerSetting;

  TextOptions: Array<string>;
  TextAligns: Array<string>;
  MaxResolutions: Array<number>;
  Baselines: Array<string>;
  Fonts: Array<string>;
  Weights: Array<string>;
  Placements: Array<string>;
  TempTextStyle: TextStyle;


  @Input("LayerItem")
  set setLayerItem(layerItem: LayerItem) {
    if (layerItem) {
      this.CurrentLayersItem = layerItem;
      if (this.CurrentLayersItem) {
        let LayerOnMap = this.olMapService.getLayerById(this.CurrentLayersItem.dataId);
        if (this.CurrentLayersItem.type === "shp") {
          this.layerSetting = this.CurrentLayersItem.layerSetting;
          this.layerSettingOnMap = LayerOnMap.layerSetting;
          this.setLabelStyle(LayerOnMap);
        }
      }
    } else {
      this.CurrentLayersItem = null;
    }
  }


  constructor(private olMapService: OlMapService,
    private utilService: UtilService) { }

  ngOnInit() {

  }

  setLabelStyle(LayerOnMap) {

    this.TextOptions = ['normal', 'shorten', 'wrap'];
    this.TextAligns = ['center', 'end', 'left', 'right', 'start'];
    this.MaxResolutions = [38400, 19200, 9600, 4800, 2400, 1200, 600, 300, 150, 75, 32, 16, 8];
    this.Baselines = ['alphabetic', 'bottom', 'hanging', 'ideographic', 'middle', 'top'];
    this.Fonts = ['Arial', 'Courier New', 'Open Sans', 'Verdana'];
    this.Weights = ['bold', 'normal'];
    let shpType = this.utilService.getGeometryType(LayerOnMap);
    switch (shpType) {
      case "Point":
      case "MultiPoint":
        this.Placements = ['point'];
        break;
      case "LineString":
      case "LinearRing":
      case "MultiLineString":
      case "Circle":
        this.Placements = ['point', 'line'];
        break;
      case "Polygon":
      case "MultiPolygon":
        this.Placements = ['point', 'line'];
        break;
      default:
        this.Placements = ['point'];
        break;
    }

    this.FieldArray = this.utilService.getFieldArray(LayerOnMap);
    if (this.FieldArray.length > 0) {
      if (this.layerSetting.VectorStyle) {
        if (this.layerSettingOnMap) {
          this.layerSetting.VectorStyle.TextField = this.layerSettingOnMap.VectorStyle.TextField;
          this.layerSetting.ShowLabel = this.layerSettingOnMap.ShowLabel;

          this.layerSetting.VectorStyle.TextStyle.Align = this.layerSettingOnMap.VectorStyle.TextStyle.Align;
          this.layerSetting.VectorStyle.TextStyle.BaseLine = this.layerSettingOnMap.VectorStyle.TextStyle.BaseLine;
          this.layerSetting.VectorStyle.TextStyle.Color = this.layerSettingOnMap.VectorStyle.TextStyle.Color;
          this.layerSetting.VectorStyle.TextStyle.ExceedLen = this.layerSettingOnMap.VectorStyle.TextStyle.ExceedLen;
          this.layerSetting.VectorStyle.TextStyle.Font = this.layerSettingOnMap.VectorStyle.TextStyle.Font;
          this.layerSetting.VectorStyle.TextStyle.MaxAngle = this.layerSettingOnMap.VectorStyle.TextStyle.MaxAngle;
          this.layerSetting.VectorStyle.TextStyle.MaxResolution = this.layerSettingOnMap.VectorStyle.TextStyle.MaxResolution;
          this.layerSetting.VectorStyle.TextStyle.OffsetX = this.layerSettingOnMap.VectorStyle.TextStyle.OffsetX;
          this.layerSetting.VectorStyle.TextStyle.OffsetY = this.layerSettingOnMap.VectorStyle.TextStyle.OffsetY;
          this.layerSetting.VectorStyle.TextStyle.OutLineColor = this.layerSettingOnMap.VectorStyle.TextStyle.OutLineColor;
          this.layerSetting.VectorStyle.TextStyle.OutLineWidth = this.layerSettingOnMap.VectorStyle.TextStyle.OutLineWidth;
          this.layerSetting.VectorStyle.TextStyle.Placement = this.layerSettingOnMap.VectorStyle.TextStyle.Placement;
          this.layerSetting.VectorStyle.TextStyle.Rotation = this.layerSettingOnMap.VectorStyle.TextStyle.Rotation;
          this.layerSetting.VectorStyle.TextStyle.Size = this.layerSettingOnMap.VectorStyle.TextStyle.Size;
          this.layerSetting.VectorStyle.TextStyle.Type = this.layerSettingOnMap.VectorStyle.TextStyle.Type;
          this.layerSetting.VectorStyle.TextStyle.Weight = this.layerSettingOnMap.VectorStyle.TextStyle.Weight;

        } else {
          this.layerSetting.VectorStyle.TextField = this.FieldArray[0];
          this.layerSetting.ShowLabel = false;
          this.layerSetting.VectorStyle.TextStyle.Align = 'center';
          this.layerSetting.VectorStyle.TextStyle.BaseLine = 'middle';
          this.layerSetting.VectorStyle.TextStyle.Color = '#464648';
          this.layerSetting.VectorStyle.TextStyle.ExceedLen = true;
          this.layerSetting.VectorStyle.TextStyle.Font = 'Arial';
          this.layerSetting.VectorStyle.TextStyle.MaxAngle = 360;
          this.layerSetting.VectorStyle.TextStyle.MaxResolution = 1200;
          this.layerSetting.VectorStyle.TextStyle.OffsetX = 0;
          this.layerSetting.VectorStyle.TextStyle.OffsetY = 0;
          this.layerSetting.VectorStyle.TextStyle.OutLineColor = '#777';
          this.layerSetting.VectorStyle.TextStyle.OutLineWidth = 0;
          this.layerSetting.VectorStyle.TextStyle.Placement = 'point';
          this.layerSetting.VectorStyle.TextStyle.Rotation = 0;
          this.layerSetting.VectorStyle.TextStyle.Size = 12;
          this.layerSetting.VectorStyle.TextStyle.Type = 'normal';
          this.layerSetting.VectorStyle.TextStyle.Weight = 'normal';
        }




      }
    }

  }

  formatterAngle = value => `${value}°`;
  parserAngle = value => value.replace('°', '');
  formatterPercent = value => `${value}%`;
  parserPercent = value => value.replace('%', '');
  formatterDollar = value => `$${value}`;
  parserDollar = value => value.replace('$', '');
  formatterInt = value => parseInt(value, 10);
  parserInt = value => parseInt(value, 10);
  formatterPixel = value => `${value}px`;
  parserPixel = value => value.replace('px', '');
}
