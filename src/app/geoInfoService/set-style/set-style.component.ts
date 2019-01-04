import { Component, OnInit, Input } from '@angular/core';
import {
  ColorBand,
  LayerSetting,
  LayerItem,
  VectorStyle,
  OlMapService,
  UtilService
} from '../../_common';

@Component({
  selector: 'app-set-style',
  templateUrl: './set-style.component.html',
  styleUrls: ['./set-style.component.css']
})
export class SetStyleComponent implements OnInit {
  private CurrentColorBand: ColorBand;
  private showColorBand: boolean = false;
  CurrentLayersItem: LayerItem;
  private VectorStyle: VectorStyle;
  private ElemsVisible: any;
  layerSetting: LayerSetting;
  private onMapLayerSetting: LayerSetting;
  value1 = 1;

  @Input("LayerItem")
  set setLayerItem(layerItem: LayerItem) {
    if (layerItem) {
      this.CurrentLayersItem = layerItem;
      this.layerSetting = this.CurrentLayersItem.layerSetting;
    } else {
      this.CurrentLayersItem = null;
    }
  }

  constructor(private olMapService: OlMapService,
    private utilService: UtilService) {
  }

  ngOnInit() {
    if (this.CurrentLayersItem && this.layerSetting) {
      this.ElemsVisible = new Map<string, boolean>();
      let LayerOnMap = this.olMapService.getLayerById(this.CurrentLayersItem.dataId);
      this.onMapLayerSetting = LayerOnMap.layerSetting;
      if (this.onMapLayerSetting && this.onMapLayerSetting.ColorBand) {
        this.CurrentColorBand = this.onMapLayerSetting.ColorBand;
      }
      this.ElemsVisible.Opacity = true;
      if (this.onMapLayerSetting) {
        this.layerSetting.Opacity = this.onMapLayerSetting.Opacity;
      } else {
        this.layerSetting.Opacity = 100;
      }

      if (this.CurrentLayersItem.type === "shp") {
        this.getLayerStyle(LayerOnMap);
      }
    }
  }


  onBandChanged(colorBand: ColorBand) {
    this.CurrentColorBand = colorBand;
    this.showColorBand = false;
    this.layerSetting.ColorBand = this.CurrentColorBand;
  }

  onColorChange(color) {
  }

  onChangeColor(color) {
    return color;
  }
  onChooseBandClick(ev: Event) {
    this.showColorBand = true;
    ev.stopPropagation();
  }
  onModalClick() {
    this.showColorBand = false;
  }

  getLayerStyle(LayerOnMap: any) {

    let CurrentStyle: VectorStyle;
    if (LayerOnMap.layerSetting) {

      CurrentStyle = this.onMapLayerSetting.VectorStyle;
    } else {
      CurrentStyle = this.utilService.getStyleFromLayerOnMap(LayerOnMap);
    }
    this.VectorStyle = new VectorStyle();

    let FeatureType = this.utilService.getGeometryType(LayerOnMap);
    //根据不同的几何数据类型来加载不同的样式修改选项
    switch (FeatureType) {
      case "Point":
      case "MultiPoint":
        this.ElemsVisible.ImageFillColor = true;
        this.ElemsVisible.ImageStrokeColor = true;
        this.ElemsVisible.ImageStrokeWidth = true;
        this.ElemsVisible.ImageRadius = true;
        this.VectorStyle.ImageFillColor = CurrentStyle.ImageFillColor ? CurrentStyle.ImageFillColor : '#6699cc';
        this.VectorStyle.ImageStrokeColor = CurrentStyle.ImageStrokeColor ? CurrentStyle.ImageStrokeColor : '#6699cc';
        this.VectorStyle.ImageStrokeWidth = CurrentStyle.ImageStrokeWidth ? CurrentStyle.ImageStrokeWidth : 1.25;
        this.VectorStyle.ImageRadius = CurrentStyle.ImageRadius ? CurrentStyle.ImageRadius : 5;
        break;
      case "LineString":
      case "LinearRing":
      case "MultiLineString":
      case "Circle":
        this.ElemsVisible.StrokeColor = true;
        this.ElemsVisible.StrokeWidth = true;
        this.VectorStyle.StrokeColor = CurrentStyle.StrokeColor ? CurrentStyle.StrokeColor : "#6699cc";
        this.VectorStyle.StrokeWidth = CurrentStyle.StrokeWidth ? CurrentStyle.StrokeWidth : 1.25;
        break;
      case "Polygon":
      case "MultiPolygon":
        this.ElemsVisible.FillColor = true;
        this.ElemsVisible.StrokeColor = true;
        this.ElemsVisible.StrokeWidth = true;
        this.VectorStyle.FillColor = CurrentStyle.FillColor ? CurrentStyle.FillColor : "#6699cc";
        this.VectorStyle.StrokeColor = CurrentStyle.StrokeColor ? CurrentStyle.StrokeColor : "#6699cc";
        this.VectorStyle.StrokeWidth = CurrentStyle.StrokeWidth ? CurrentStyle.StrokeWidth : 1.25;
        break;
      default:
        console.log("FeatureType " + FeatureType);
        break;
    }

    this.layerSetting.VectorStyle = this.VectorStyle;
  }
  handle(Opacity: number) {
    this.layerSetting.Opacity = Opacity;

  }
  onClickSlider(ev: Event) {
  }
  formatValue(a: number) {
    return `${a}%`;
  }

}
