import { Extent } from 'ol/extent';
import { _HttpClient } from './../httpUtils/http.client';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core'
import { DataTransmissionService } from './data-transmission.service'
import { GeoJsonLayer, LayerItem, ImageLayer, WktProjection, LayerSetting, TextStyle, LoadingInfo, DataItem, DataInfo } from '../data_model'
import proj4 from 'proj4'
import Xml2js from 'Xml2js';
import { UtilService } from './util.service';
import * as FileSaver from 'file-saver';
import { HttpService } from './http.service';
import { GlobeConfigService } from './globe.config.service';
import { Observable } from 'rxjs';
declare let ol: any;
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { DC_DATA_TYPE, VISIBLE_STATUS } from '../enum';

@Injectable()
export class OlMapService {

    private OpacityStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,255,0)',
            width: 1.25,
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,255,255,0)',
                width: 1.25,
            }),
            radius: 5
        }),
        text: new ol.style.Text({
            color: 'rgba(255,255,255,0)',
        })
    })
    public MapObject: any;
    private layerItems: Array<LayerItem>;
    private baseUrl: string;
    private geoserverWmsUrl;
    private geoserverWfsUrl;
    constructor(
        private dataTransmissionService: DataTransmissionService,
        private httpService: HttpService,
        private utilService: UtilService,
        private globeConfigService: GlobeConfigService,
        @Inject("API") private api,
        private http: HttpClient,
    ) {
        this.baseUrl = `${this.httpService.api.backend}`;
        this.geoserverWmsUrl = `${this.api.backend_geoserver}/datacontainer/wms`;
        this.geoserverWfsUrl = `${this.api.backend_geoserver}/datacontainer/wfs`;
    }

    //初始化
    initMapService(MapObject: any) {
        this.MapObject = MapObject;
        this.dataTransmissionService.getLayerListSubject().subscribe(layerItems => {
            this.layerItems = layerItems;
        })
    }

    isDataOnLayer(id: string) {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let Layers: Array<any> = this.MapObject.getLayers().getArray();
        let FindedLayers: Array<any> = Layers.filter((value) => {
            return value.id === id;
        })
        if (FindedLayers.length >= 1) {
            return true;
        } else {
            return false;
        }
    }

    //将geojson添加至Vector图层
    addVectorLayer(geoJsonLayer: GeoJsonLayer, pStyle?: any, modifyExtentOfProj?: boolean, allDeclutter?: boolean) {

        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let geoJsonObject = geoJsonLayer.data;
        if (this.isDataOnLayer(geoJsonLayer.id)) {
            console.log("要素已经位于图层中");
            return;
        }
        let vectorSource;
        //! 如何判断当前加载的图层数据是 EPSG:3857 还是 EPSG:4326呢？
        //! 目前通过投影信息的单位来判断
        let projInfo: string = geoJsonObject.proj;
        let is4326: boolean = projInfo.substring(projInfo.lastIndexOf('UNIT[')).includes("Degree");
        if (projInfo === "" || projInfo == undefined) {
            is4326 = true;
        }
        if (is4326) {
            vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geoJsonObject.geojson)
            });
        } else {
            vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geoJsonObject.geojson, {     // 用readFeatures方法可以自定义坐标系
                    dataProjection: 'EPSG:3857',    // 设定JSON数据使用的坐标系
                    featureProjection: 'EPSG:4326' // 设定当前地图使用的feature的坐标系
                })
            });
        }

        //样式改变测试
        let VectorFill = new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)'
        })

        let pointFill = new ol.style.Fill({
            color: '#3399CC'
        })

        let VectorStroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
        })

        let TextStyle = new ol.style.Text({
            color: '#777'
        })

        let ImgaeStyle = new ol.style.Circle({
            fill: pointFill,
            stroke: VectorStroke,
            radius: 4
        })

        let LayerStyles = new ol.style.Style({
            fill: VectorFill,
            stroke: VectorStroke,
            image: ImgaeStyle,
            text: TextStyle
        })

        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: (feature, resolution) => {
                let NewStyle = new ol.style.Style({
                    fill: pStyle ? pStyle.getFill() : VectorFill,
                    stroke: pStyle ? pStyle.getStroke() : VectorStroke,
                    image: pStyle ? pStyle.getImage() : ImgaeStyle,
                    text: this.createStyle(feature, resolution, null)
                })
                return NewStyle;
            },
            //避让
            declutter: (() => {
                let shpType = this.utilService.getGeometryTypeFromSource(vectorSource);
                let declutterFlag = false;
                if (allDeclutter) {
                    declutterFlag = true;
                } else {
                    switch (shpType) {
                        case "Point":
                        case "MultiPoint":
                            declutterFlag = false;
                            break;
                        case "LineString":
                        case "LinearRing":
                        case "MultiLineString":
                        case "Circle":
                            declutterFlag = false;
                            break;
                        case "Polygon":
                        case "MultiPolygon":
                            declutterFlag = true;
                            break;
                        default:
                            declutterFlag = false;
                            break;
                    }
                }

                return declutterFlag;
            })()
        })
        //*将投影信息记录到vectorLayer中
        geoJsonObject.geojson = JSON.parse(geoJsonObject.geojson);
        // vectorLayer.crs = geoJsonObject.crs || geoJsonObject.geojson.crs;
        // vectorLayer.name = geoJsonObject.name || geoJsonObject.geojson.name;
        vectorLayer.crs = geoJsonObject.crs;
        vectorLayer.name = geoJsonObject.name;
        vectorLayer.id = geoJsonLayer.id;

        //proj string
        let newProjectionCode;
        if (geoJsonObject.proj && geoJsonObject.proj !== "null") {
            newProjectionCode = this.utilService.getProjByWkt(geoJsonObject.proj);
            vectorLayer.proj = new WktProjection(newProjectionCode, geoJsonObject.proj);
        }
        //范围数组
        let SourceExtentArray: Array<number> = vectorSource.getExtent();
        //let SourceExtentArray: Array<number> = [-180, 26, 124, 34];
        //判断是否有Geometry为空的情况
        let index = SourceExtentArray.findIndex(value => {
            return !Number.isFinite(value)
        })
        if (index !== -1) {
            SourceExtentArray = null;
        }
        //*判断是否有投影信息
        if (vectorLayer.crs &&
            vectorLayer.crs.properties &&
            vectorLayer.crs.properties.name) {
            let TempCode: string = vectorLayer.crs.properties.name;
            let findedIndex = -1;
            if ((findedIndex = TempCode.lastIndexOf('EPSG::')) !== -1) {
                this.setProjection(`EPSG:${TempCode.substring(findedIndex + 6)}`, SourceExtentArray, modifyExtentOfProj);
            } else {
                this.setProjection(TempCode, SourceExtentArray, modifyExtentOfProj);
            }
        } else if (newProjectionCode) {
            this.setProjection(newProjectionCode, SourceExtentArray, modifyExtentOfProj, is4326);
        } else {
            this.setProjection(null, SourceExtentArray, modifyExtentOfProj, is4326);
        }
        this.MapObject.addLayer(vectorLayer);
        //*保证地图加载不变形
        this.MapObject.updateSize();
        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
    }

    //添加图像图层
    addImageLayer(imageLayer: ImageLayer, modifyExtentOfProj?: boolean) {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        if (this.isDataOnLayer(imageLayer.id)) {
            console.log("要素已经位于图层中");
            return;
        }
        let img = new Image;
        //img.src = "data:image/jpeg;base64," + imageLayer.src;
        img.src = imageLayer.src;
        img.crossOrigin = "anonymous";
        img.onload = () => {

            let newExtent = [imageLayer.extent[0],
            imageLayer.extent[3] + imageLayer.extent[5] * img.height,
            imageLayer.extent[0] + imageLayer.extent[1] * img.width,
            imageLayer.extent[3]];

            let staticImage = new ol.layer.Image({
                source: new ol.source.ImageStatic({
                    projection: ol.proj.get(imageLayer.proj),
                    imageExtent: newExtent,
                    url: img.src,
                    imageLoadFunction: (image, src) => {
                        image.getImage().src = src;
                    }
                })
            })

            staticImage.id = imageLayer.id;
            staticImage.extent = newExtent;
            staticImage.proj = imageLayer.proj;
            staticImage.getSource().getExtent = () => {
                return staticImage.extent
            }
            //重新设置范围
            this.setProjection(imageLayer.proj.name, newExtent, modifyExtentOfProj);
            this.MapObject.addLayer(staticImage);

            //保证地图加载不变形
            this.MapObject.updateSize();
            this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        }
    }

    //添加在线图层
    addOnlineLayer(onlineLayerItem: LayerItem, extent?: Array<number>) {

        if (this.isDataOnLayer(onlineLayerItem.dataId)) {
            console.log("要素已经位于图层中");
            return;
        }
        let onlineLayer = this.globeConfigService.onlineLayers;
        let findLayer: any = this.globeConfigService.onlineLayers.find(value => {
            return value['id'] === onlineLayerItem.dataId;
        })
        let currentLayer: Array<any> = findLayer["layer"];
        //currentLayer.id = onlineLayerItem.dataId;
        let currentProjection = this.MapObject.getView().getProjection();

        if (extent != null) {
            currentProjection.setExtent(extent);
        }
        //currentLayer.proj = currentProjection;
        for (var i = 0; i < currentLayer.length; i++) {
            currentLayer[i].id = onlineLayerItem.dataId;
            currentLayer[i].proj = currentProjection;
            this.MapObject.addLayer(currentLayer[i]);
        }
        //保证地图加载不变形
        this.MapObject.updateSize();
        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));

    }

    //* geoserver服务器获取 wfs数据
    getWFSGeojsonData(geoserverLayerName: string): Observable<any> {
        let layerName = geoserverLayerName.substring(0, geoserverLayerName.lastIndexOf('.'));
        let url = this.geoserverWfsUrl + "/?service=WFS&request=GetFeature&version=1.1.0&typename=" + layerName + "&outputFormat=json";
        return this.http.get(url).pipe(
            map(res => {
                console.log("addToolRecord:" + res);
                return res;
            })
        )
    }

    //* 将geoserver中的地图服务添加进图层
    addGeoserverLayer(geoserverLayerItem: LayerItem, geoserverDataInfo: DataInfo,index:number) {
        if (this.isDataOnLayer(geoserverLayerItem.dataId)) {
            console.log("要素已经位于图层中");
            return;
        }
        let geoserverLayerName = geoserverDataInfo.layerName[index];
        let proj = "";
        let extent: Array<number>;
        if ((geoserverDataInfo.type === DC_DATA_TYPE.SHAPEFILE || geoserverDataInfo.type === DC_DATA_TYPE.GEOTIFF 
            || geoserverDataInfo.type === DC_DATA_TYPE.SDAT || geoserverDataInfo.type === DC_DATA_TYPE.SHAPEFILE_LIST
            || geoserverDataInfo.type === DC_DATA_TYPE.GEOTIFF_LIST || geoserverDataInfo.type === DC_DATA_TYPE.SDAT_LIST) && geoserverDataInfo.meta && geoserverDataInfo.meta[index]) {
            proj = geoserverDataInfo.meta[index].proj;
            // console.log("投影信息：", proj);
            extent = geoserverDataInfo.meta[index].extent;
            try{
                // let mapProj = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
                // let lower = proj4(mapProj,proj,[extent[0], extent[1]]);
                // let upper = proj4(mapProj,proj,[extent[2], extent[3]]);
                let lower = proj4(proj).inverse([extent[0], extent[1]]);
                let upper = proj4(proj).inverse([extent[2], extent[3]]);
                extent = _.concat(lower, upper);
                // console.log("extent信息：", extent);
            }catch(error){ 
                return "error";
            }
           
        }

        let layerName = geoserverLayerName.substring(0, geoserverLayerName.lastIndexOf('.'));
        console.log("layerName:", layerName);
        let newLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverWmsUrl,
                params: {
                    'LAYERS': layerName,
                    'TILED': false
                },
                serverType: 'geoserver'    //服务器类型
            })
        });
        let extent_test: Array<number> = newLayer.getExtent();
        // console.log("从图层读取extent:", extent_test);

        //* 已知 proj 和 extent, 设置图层的proj和 extent
        let newProjectionCode;
        if (proj && proj!==""&& proj !== "null") {
            newProjectionCode = this.utilService.getProjByWkt(proj);
            newLayer.proj = new WktProjection(newProjectionCode, proj);
        }

        if (extent&& extent[0]<=180) {
            let newView = new ol.View({
                projection: ol.proj.get('EPSG:4326'),
                center: ol.extent.getCenter(extent),
                zoom: 3
            });
            this.MapObject.setView(newView);
            newView.fit(extent);
        }
        newLayer.id = geoserverLayerItem.dataId;
        newLayer.name = geoserverLayerItem.name;
        geoserverDataInfo.visibleStatus = VISIBLE_STATUS.VISIBLE;
        this.dataTransmissionService.sendAddToLayerSubject(geoserverDataInfo);
        this.MapObject.addLayer(newLayer);
        //保证地图加载不变形
        this.MapObject.updateSize();
    }

    //显示或者隐藏图层
    showOrHideLayer(id: string, select: any, DragBox: any, canSelect: boolean) {

        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let Layers: Array<any> = this.MapObject.getLayers().getArray();
        let FindedLayers: Array<any> = Layers.filter((value) => {
            return value.id === id;
        })
        if (FindedLayers.length >= 1) {
            FindedLayers.forEach(item => {
                if (item.getVisible()) {
                    item.setVisible(false);
                } else {
                    item.setVisible(true);
                }
            })
        }
    }

    //移除图层
    removeLayer(id: string) {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let Layers: Array<any> = this.MapObject.getLayers().getArray();
        let FindedLayers: Array<any> = Layers.filter((value) => {
            return value.id === id;
        })
        if (FindedLayers.length >= 1) {
            FindedLayers.forEach(item => {
                this.MapObject.removeLayer(item);
            })
            // this.MapObject.removeLayer(FindedLayers[0]);
        }
    }

    //通过id获取图层
    getLayerById(id: string): any {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let Layers: Array<any> = this.MapObject.getLayers().getArray();
        let FindedLayers: Array<any> = Layers.filter((value) => {
            return value.id === id;
        })
        return FindedLayers[0];
    }

    //设置地图投影
    setProjection(code: string, FeatureExtent?: Array<number>, modifyExtentOfProj?: boolean, transformProj?: boolean): void {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        //默认图层范围
        let DefaultExtent = ol.proj.get('EPSG:4326').getExtent();
        //*改变featureExtent的值，变为
        let currentProjection = this.MapObject.getView().getProjection();
        if (code === null) {
            console.warn(`No EPSG_CODE. switch to ${currentProjection.getCode()}.`);
            //缩放到图层范围

            if (FeatureExtent) {
                this.MapObject.getView().fit(FeatureExtent);
            }

        } else {
            let newProj = ol.proj.get(code);
            // if (transformProj) {
            ol.proj.transform(newProj, code, 'EPSG:4326')
            // }
            if (!newProj) {
                console.warn(`unknown EPSG_CODE ${code}. switch to EPSG:4326.`)
                newProj = ol.proj.get('EPSG:4326');
            }

            let LayerExtent;
            if (FeatureExtent) {
                LayerExtent = FeatureExtent;
            } else {
                LayerExtent = DefaultExtent;
            }

            if (modifyExtentOfProj) {
                newProj.setExtent(LayerExtent);
            }

            let newView = new ol.View({
                projection: newProj,
                center: ol.extent.getCenter(LayerExtent),
                zoom: 1
            });
            this.MapObject.setView(newView);
            //保证地图加载不变形
            this.MapObject.updateSize();
            //缩放到图层范围
            newView.fit(LayerExtent);
        }
    }

    //获取所有的layer
    getAllLayers(): Array<any> {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        return this.MapObject.getLayers().getArray();
    }

    //下载数据
    downloadFile(layer: LayerItem, filename: string, dataItem: DataItem) {
        let aLink = document.createElement('a');
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        //在本地
        if (layer.file) {
            if (dataItem.id === "ESRI_SHAPEFILE") {
                aLink.download = filename;
                aLink.href = URL.createObjectURL(layer.file);
            } else if (dataItem.id = "GEOJSON") {
                var layerOnMap = this.getLayerById(layer.dataId);
                if (layerOnMap != null) {

                    let geojson = new ol.format.GeoJSON().writeFeatures(layerOnMap.getSource().getFeatures());
                    let geojsonObject = JSON.parse(geojson);
                    geojsonObject.name = layer.name;
                    let srsStr = "";
                    if (layerOnMap.proj) {
                        srsStr = layerOnMap.proj.wkt;
                    } else if (layerOnMap.crs) {
                        geojsonObject.crs = layerOnMap.crs;
                    } else {
                        geojsonObject.crs = { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4326" } };
                    }

                    var tempBlob = new Blob([JSON.stringify(geojsonObject)]);
                    aLink.download = filename;
                    aLink.href = URL.createObjectURL(tempBlob);

                }
            }
            //在服务容器上 
        } else {

            if (dataItem.id === "ESRI_SHAPEFILE") {
                let dataPath = "http://" + window.location.host + this.baseUrl + "/download?ip=" + this.httpService.SagaIp + "&id=" + layer.dataId + "&filename=" + filename;
                aLink.href = new URL(dataPath).toString();
            } else if (dataItem.id = "GEOJSON") {

            }
        }
        aLink.click();
        aLink.dispatchEvent(evt);
        console.log(`download ${filename}`)
    }

    //下载当前视图为图片
    downloadMap() {

        this.MapObject.once('postcompose', function (event) {

            var canvas = event.context.canvas;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            } else {
                canvas.toBlob(function (blob) {
                    FileSaver.saveAs(blob, 'map.png');
                });
            }
        });
        this.MapObject.renderSync();
    }

    //从图层中获取投影信息
    getCRS(LayerId: string): any {
        if (!this.MapObject) {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
        let Layers: Array<any> = this.MapObject.getLayers().getArray();
        let FindedLayers: Array<any> = Layers.filter((value) => {
            return value.id === LayerId;
        })
        return FindedLayers[0].crs;
    }
    //full extent
    setFullExtent(LayerId?: string, extent?: Array<number>) {
        if (this.MapObject) {
            let CurrentLayer;
            let Layers: Array<any> = this.MapObject.getLayers().getArray();
            if (Layers.length > 0) {
                if (LayerId) {
                    let FindedLayers: Array<any> = Layers.filter((value) => {
                        return value.id === LayerId;
                    })
                    CurrentLayer = FindedLayers[0];
                } else {
                    CurrentLayer = Layers[0];
                }
                if (CurrentLayer) {

                    let findLayer = this.layerItems.find(value => {
                        return value.dataId === CurrentLayer.id;
                    });
                    //如果是在线地图则不予缩放
                    if (findLayer.type === "ONLINE") {
                        return;
                    }
                    console.log("layer source:", CurrentLayer.getSource());
                    let SourceExtentArray: Array<number>;
                    if (findLayer.extent) {
                        SourceExtentArray = findLayer.extent;
                        let lower = proj4(findLayer.proj).inverse([SourceExtentArray[0], SourceExtentArray[1]]);
                        let upper = proj4(findLayer.proj).inverse([SourceExtentArray[2], SourceExtentArray[3]]);
                        SourceExtentArray = _.concat(lower, upper);
                        if(SourceExtentArray[0]>180){
                            return;
                        }
                    } else {
                        SourceExtentArray = CurrentLayer.getSource().getExtent();
                    }

                    if (extent != null && extent.length > 0) {
                        SourceExtentArray = extent;
                    }
                    let index = SourceExtentArray.findIndex(value => {
                        return !Number.isFinite(value);
                    })
                    if (index !== -1 ) {
                        SourceExtentArray = null;
                    }
                    if (SourceExtentArray) {
                        this.MapObject.getView().fit(SourceExtentArray);
                    }
                }
            }
        } else {
            console.error("Map object in ol-map service is undefined.");
            return null;
        }
    }


    /////////////////////setting///////////////////////
    applySetting(layerItem: LayerItem) {
        if (layerItem) {
            if (layerItem.layerSetting) {
                //设置透明度
                let layerSetting = layerItem.layerSetting;
                if (layerSetting.Opacity) {
                    let TempLayer = this.getLayerById(layerItem.dataId);
                    TempLayer.setOpacity(layerSetting.Opacity / 100);
                }
                if (layerItem.type === "tif") {
                    if (layerSetting.ColorBand) {
                        this.httpService.getColorMap(layerItem, layerSetting.ColorBand.ColorArrayStr).then(ResponseData => {
                            if (ResponseData && ResponseData["code"] !== undefined) {
                                if (ResponseData["code"] === 0) {
                                    if (ResponseData['data']) {
                                        let imageLayer = this.utilService.ResToImageLayer(ResponseData);
                                        //传给olMap
                                        imageLayer.id = layerItem.dataId;
                                        this.setLayerSource(imageLayer, layerItem, layerSetting);
                                        layerItem.visible = !layerItem.visible;
                                        layerItem.isOnMap = true;
                                        layerItem.layerShowing = false;
                                        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                                    } else {
                                        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                                        return;
                                    }
                                } else {
                                    this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                                    return;
                                }
                            } else {
                                this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                                return;
                            }
                        })
                    }
                } else if (layerItem.type === "shp") {
                    let TempLayer = this.getLayerById(layerItem.dataId);
                    // if (layerSetting.ShowLabel) {
                    //     TempLayer.set('declutter', true, null);

                    // } else {
                    //     TempLayer.set('declutter', false, null);
                    // }
                    TempLayer.set('source', TempLayer.getSource());
                    TempLayer.set('declutter', true);

                    let VectorStyle = layerSetting.VectorStyle;

                    if (VectorStyle !== null) {
                        let VectorFill = new ol.style.Fill({
                            color: VectorStyle.FillColor
                        })

                        let VectorStroke = new ol.style.Stroke({
                            color: VectorStyle.StrokeColor,
                            width: VectorStyle.StrokeWidth
                        })

                        let pointFill = new ol.style.Fill({
                            color: VectorStyle.ImageFillColor
                        })

                        let PointStroke = new ol.style.Stroke({
                            color: VectorStyle.ImageStrokeColor,
                            width: VectorStyle.ImageStrokeWidth
                        })

                        TempLayer.setStyle((feature, resolution) => {

                            let NewStyle = new ol.style.Style({
                                fill: VectorFill,
                                stroke: VectorStroke,
                                image: new ol.style.Circle({
                                    fill: pointFill,
                                    stroke: PointStroke,
                                    radius: VectorStyle.ImageRadius
                                }),
                                text: this.createStyle(feature, resolution, layerSetting)
                            })
                            return NewStyle;
                        });

                    }
                    //将图层列表项的图层设置拷贝一份到对应地图图层上，用于用户改动样式设置，却没有点击应用，还原回去。
                    TempLayer.layerSetting = layerSetting.clone();

                }
            }

        }
    }

    createStyle(feature, resolution, layerSetting: LayerSetting) {
        let TextStyle;
        if (layerSetting && layerSetting.ShowLabel && feature) {
            let TempText = feature.getProperties()[layerSetting.VectorStyle.TextField];
            if (layerSetting.VectorStyle && layerSetting.VectorStyle.TextStyle) {
                let TextStyleSetting: TextStyle = layerSetting.VectorStyle.TextStyle;
                if (TempText !== null) {
                    TextStyle = new ol.style.Text({
                        color: TextStyleSetting.Color,
                        font: TextStyleSetting.Weight + ' ' + TextStyleSetting.Size + 'px ' + TextStyleSetting.Font,
                        fill: new ol.style.Fill({ color: TextStyleSetting.Color }),
                        offsetX: TextStyleSetting.OffsetX,
                        offsetY: TextStyleSetting.OffsetY,
                        overflow: TextStyleSetting.ExceedLen,
                        placement: TextStyleSetting.Placement,
                        maxAngle: TextStyleSetting.MaxAngle * Math.PI / 180,
                        rotation: TextStyleSetting.Rotation * Math.PI / 180,
                        stroke: new ol.style.Stroke({ color: TextStyleSetting.OutLineColor, width: TextStyleSetting.OutLineWidth }),
                        textAlign: TextStyleSetting.Align,
                        textBaseline: TextStyleSetting.BaseLine,
                        text: this.getText(TempText, resolution, TextStyleSetting)
                    })
                }
            } else {
                TextStyle = new ol.style.Text({
                    color: '#777',
                    text: this.getText(TempText, resolution, null)
                })
            }
        } else {
            TextStyle = new ol.style.Text({
                color: '#777',
                text: this.getText(' ', resolution, null)
            })
        }
        return TextStyle;
    }

    getText(TempText: any, resolution, TextStyleSetting: TextStyle) {
        let text = TempText.toString();
        if (TextStyleSetting) {
            let type: string = TextStyleSetting.Type;
            let maxResolution: number = TextStyleSetting.MaxResolution ? TextStyleSetting.MaxResolution : 1200;
            let placement: string = TextStyleSetting.Placement;

            if (maxResolution)
                if (resolution > maxResolution) {
                    text = '';
                } else if (type == 'shorten') {
                    text = this.utilService.stringTrunc(text, 12);
                } else if (type == 'wrap' && placement != 'line') {
                    text = this.utilService.stringDivider(text, 16, '\n');
                }
        }

        return text;

    }

    setLayerSource(imageLayer: ImageLayer, layerItem: LayerItem, layerSetting: LayerSetting) {
        imageLayer.id = layerItem.dataId;
        let findLayer = this.getLayerById(imageLayer.id);
        let img = new Image;
        img.src = imageLayer.src;
        img.crossOrigin = "anonymous";
        img.onload = () => {

            let newExtent = [imageLayer.extent[0],
            imageLayer.extent[3] + imageLayer.extent[5] * img.height,
            imageLayer.extent[0] + imageLayer.extent[1] * img.width,
            imageLayer.extent[3]];

            let LayerSource = new ol.source.ImageStatic({
                projection: ol.proj.get(imageLayer.proj),
                imageExtent: newExtent,
                url: img.src,
                imageLoadFunction: (image, src) => {
                    image.getImage().src = src;
                }
            })
            findLayer.setSource(LayerSource);
            //将图层列表项的图层设置拷贝一份到对应地图图层上，用于用户改动样式设置，却没有点击应用，还原回去。
            findLayer.layerSetting = layerSetting.clone();
            this.MapObject.updateSize();
        }
    }

    addStyle(FeatureArray: Array<any>, style: any, ZoomFlag?: boolean) {

        let AllCoordinates = [];

        FeatureArray.forEach(value => {
            let tempCoordinates: Array<Array<number>> = value.getGeometry().getCoordinates();
            tempCoordinates.forEach(value => {
                AllCoordinates.push(value);
            })
            value.setStyle(style);

        })
        //构建临时几何图形，用于缩放定位
        if (ZoomFlag) {
            var tempGeometry = new ol.geom.LineString(AllCoordinates, 'XY');
            this.MapObject.getView().fit(tempGeometry, { padding: [170, 50, 30, 150], constrainResolution: false });
        }

    }
    restoreStyle(currentFeaturesArray: Array<any>) {
        if (currentFeaturesArray != null) {
            currentFeaturesArray.forEach(value => {
                value.setStyle(null);
            })
        }
    }

    ///////////////////////2018/06/18//////////////
    //增加在线底图的添加功能



}