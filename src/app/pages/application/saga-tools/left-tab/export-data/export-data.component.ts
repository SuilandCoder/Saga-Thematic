import { Inject } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  DataTransmissionService,
  DataItem,
  LayerItem,
  GeoData,
  OlMapService,
  HttpService
} from 'src/app/_common';

declare let ol: any;
@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.css']
})
export class ExportDataComponent implements OnInit, AfterViewInit {

  title: string;
  private CurrentDataFormat: DataItem;
  private dataFormats: Array<DataItem> = [];
  private CurrentExportFeature: DataItem;
  private exportFeatures: Array<DataItem> = [];
  CurrentExportName: string;
  private ExportLayerItem: LayerItem;
  private ExportSelectObject: any;
  notShp: boolean;

  constructor(private dataTransmissionService: DataTransmissionService,
    private httpService: HttpService,
    private olMapService: OlMapService) { }

  ngOnInit() {
    this.title = "Export Data";
    this.notShp = false;
    this.dataFormats.push(new DataItem('ESRI_SHAPEFILE', "Esri Shapefile"));
    this.dataFormats.push(new DataItem('GEOJSON', "geojson file"));
    this.exportFeatures.push(new DataItem('ALL', 'All Features'));

    this.CurrentDataFormat = this.dataFormats.length > 0 ? this.dataFormats[0] : null;
    this.CurrentExportFeature = this.exportFeatures.length > 0 ? this.exportFeatures[0] : null;

    this.dataTransmissionService.getAllSelectedFeaturesSubject().subscribe(select => {
      if (select && this.ExportLayerItem && select.layer) {
        if (select.getFeatures().getLength() > 0 && this.ExportLayerItem.dataId === select.layer.id) {
          if (!this.exportFeatures.find(value => {
            return value.id === "SELECT";
          })) {
            this.exportFeatures.push(new DataItem('SELECT', 'Selected Features'));
            this.ExportSelectObject = select;
          }
        } else {
          this.exportFeatures.splice(1, 1);
        }
      } else {
        if (this.exportFeatures.find(value => {
          return value.id === "SELECT";
        })) {
          this.exportFeatures.splice(1, 1);
        }
      }
    })
  }

  ngAfterViewInit() {
    this.dataTransmissionService.getExportDataSubject().subscribe(layerItem => {
      if (layerItem.type === "shp") {
        this.notShp = false;
        this.CurrentExportName = `${layerItem.name}_Export`;
        this.ExportLayerItem = layerItem;
        this.dataTransmissionService.sendReqAllSelectedFeaturesSubject();
        this.CurrentExportFeature = this.exportFeatures.length > 0 ? this.exportFeatures[0] : null;
      } else if (layerItem.type === "tif" || layerItem.type === "sdat") {
        this.notShp = true;
        this.CurrentExportName = `${layerItem.name}_Export`;
        this.ExportLayerItem = layerItem;
      }

      document.getElementById("showExportDialog").click();
    });
    //adjusting style
    // document.getElementById("showExportDialog").click();
  }

  onDataFormatItemSelected(dataFormatItem: DataItem) {
    this.CurrentDataFormat = dataFormatItem;
  }
  onExportFeatureSelected(exportFeature: DataItem) {
    this.CurrentExportFeature = exportFeature;
  }

  onExportClick() {
    switch (this.CurrentExportFeature.id) {
      case 'ALL':
        this.onExportAll();
        break;
      case 'SELECT':
        this.onExportSelected();
        break;
      default:
        break;
    }
  }



  onExportAll() {
    //执行导出所有的操作
    this.olMapService.downloadFile(this.ExportLayerItem, this.CurrentExportName, this.CurrentDataFormat);

  }

  //传至后台生成shpFile,在Data 列表下提供下载
  onExportSelected() {
    //执行导出选中的操作
    if (this.ExportSelectObject && this.ExportSelectObject.getFeatures().getLength() > 0) {
      let Layer = this.ExportSelectObject.layer;
      let geojson = new ol.format.GeoJSON().writeFeatures(this.ExportSelectObject.getFeatures().getArray());
      let geojsonObject = JSON.parse(geojson);
      geojsonObject.name = Layer.name;
      let srsStr = "";
      if (Layer.proj) {
        srsStr = Layer.proj.wkt;
      } else if (Layer.crs) {
        geojsonObject.crs = Layer.crs;
      } else {
        geojsonObject.crs = { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4326" } };
      }

      this.httpService.geojsonToShape(geojsonObject, srsStr).then(res => {
        if (res['data']) {
          let ResDataJson = JSON.parse(res['data']);
          if (ResDataJson && ResDataJson.gd_id) {
            let gd_id = ResDataJson.gd_id;
            this.dataTransmissionService.sendRemoteData(new GeoData(this.CurrentExportName,
              '',
              0,
              gd_id));
          } else {
            console.log(res);
          }
        } else {
          console.log(res);
        }

      })
    }
  }
}
