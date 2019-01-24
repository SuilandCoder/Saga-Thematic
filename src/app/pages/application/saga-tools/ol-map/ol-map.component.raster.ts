// import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';
// import Xml2js from 'xml2js'

// import { DataTransmissionService } from '../../services/data-transmission.service'
// import { ModelContainerService } from '../../services/model-container.service'
// import { OlMapService } from '../../services/ol-map.service'
// import { WindowEventService } from '../../services/window.event.service'
// import proj4 from 'proj4';


// import VectorLayer from 'ol/layer/vector'
// import Vector from 'ol/source/vector'
// import GeoJSON from 'ol/format/GeoJSON'
// import WkT from 'ol/format/wkt'
// import Proj from 'ol/proj'
// import Projection from 'ol/proj/projection'
// import BingMaps from 'ol/source/bingmaps'
// import Map from 'ol/map'
// import View from 'ol/view'
// import TileLayer from 'ol/layer/tile'
// import XYZ from 'ol/source/xyz'
// import OSM from 'ol/source/osm'
// import Extent from 'ol/extent'
// import Interaction from 'ol/interaction'
// import MapSelect from 'ol/interaction/select'
// import DragBox from 'ol/interaction/dragbox'
// import KeyCondtion from 'ol/events/condition'
// import MousePosition from 'ol/control/MousePosition'
// import Coordinate from 'ol/coordinate'
// import Style from 'ol/style/style'
// import Stroke from 'ol/style/stroke'
// import Fill from 'ol/style/fill'
// import Text from 'ol/style/text'
// import Circle from 'ol/style/circle'
// import TileWMS from 'ol/source/TileWMS'
// import Image from 'ol/layer/Image'
// import ImageWMS from 'ol/source/ImageWMS'
// import Raster from 'ol/source/raster'
// import { LayerItem, Point } from '../../data_model/data-model';
// @Component({
//   selector: 'app-ol-map',
//   templateUrl: './ol-map.component.html',
//   styleUrls: ['./ol-map.component.css']
// })



// export class OlMapComponent implements OnInit, AfterViewInit {
//   private MapObject;
//   private ButtonText: string;
//   private Layers: Array<any> = [];
//   private MapHeight: number;
//   private canSelect: boolean;
//   private select: MapSelect;
//   private selectedFeatures: any;
//   private DragBox: DragBox;
//   private SelectedLayerId: string;
//   private MouseMovePosition: Point;
//   private AllLayer: Array<any>;

//   private styles = [
//     'Road',
//     'RoadOnDemand',
//     'Aerial',
//     'AerialWithLabels',
//     'collinsBart',
//     'ordnanceSurvey'
//   ];
//   private LayerOne = new TileLayer({
//     source: new OSM()
//   });



//   private BingLayer = new TileLayer({
//     preload: Infinity,
//     source: new BingMaps({
//       key: 'AjJc6AsekcsRocEYk3NhrXNYcAZaD9owLDe7pWr_lI0rT3lmdz0i3WQe7zIO3OcT',
//       imagerySet: this.styles[2]
//     })
//   })




//   //raster test
//   private format = "image/jpeg";
//   private untiled = new Image({
//     source: new ImageWMS({
//       ratio: 1,
//       url: 'http://172.21.212.119:8080/geoserver/ogms_ws/wms',
//       params: {
//         'FORMAT': this.format,
//         'VERSION': '1.1.1',
//         STYLES: '',
//         LAYERS: 'ogms_ws:geotiff_chazhi',
//       },crossOrigin:"anonymous"
//     })
//   });
  
//   private tiled = new TileLayer({
//     visible: true,
//     source: new TileWMS({
//       url: 'http://172.21.212.119:8080/geoserver/ogms_ws/wms',
//       params: {
//         'FORMAT': this.format,
//         'VERSION': '1.1.1',
//         tiled: true,
//         STYLES: '',
//         LAYERS: 'ogms_ws:geotiff_chazhi'
//       },
//       crossOrigin:"anonymous"
//     })
    
//   });

//   private projection = new Projection({
//     code: 'EPSG:2402',
//     units: 'm',
//     axisOrientation: 'neu',
//     global: false
//   });

//    convolve(context, kernel) {
//     var canvas = context.canvas;
//     var width = canvas.width;
//     var height = canvas.height;

//     var size = Math.sqrt(kernel.length);
//     var half = Math.floor(size / 2);

//     var inputData = context.getImageData(0, 0, width, height).data;
//     var output = context.createImageData(width, height);
//     var outputData = output.data;

//     for (var pixelY = 0; pixelY < height; ++pixelY) {
//       var pixelsAbove = pixelY * width;
//       for (var pixelX = 0; pixelX < width; ++pixelX) {
//         var r = 0, g = 0, b = 0, a = 0;
//         for (var kernelY = 0; kernelY < size; ++kernelY) {
//           for (var kernelX = 0; kernelX < size; ++kernelX) {
//             var weight = kernel[kernelY * size + kernelX];
//             var neighborY = Math.min(
//                 height - 1, Math.max(0, pixelY + kernelY - half));
//             var neighborX = Math.min(
//                 width - 1, Math.max(0, pixelX + kernelX - half));
//             var inputIndex = (neighborY * width + neighborX) * 4;
//             r += inputData[inputIndex] * weight;
//             g += inputData[inputIndex + 1] * weight;
//             b += inputData[inputIndex + 2] * weight;
//             a += inputData[inputIndex + 3] * weight;
//           }
//         }
//         var outputIndex = (pixelsAbove + pixelX) * 4;
//         outputData[outputIndex] = r;
//         outputData[outputIndex + 1] = g;
//         outputData[outputIndex + 2] = b;
//         outputData[outputIndex + 3] = kernel.normalized ? a : 255;
//       }
//     }
//     context.putImageData(output, 0, 0);
//   }

//   private kernels = {
//     none: [
//       0, 0, 0,
//       0, 1, 0,
//       0, 0, 0
//     ],
//     sharpen: [
//       0, -1, 0,
//       -1, 5, -1,
//       0, -1, 0
//     ],
//     sharpenless: [
//       0, -1, 0,
//       -1, 10, -1,
//       0, -1, 0
//     ],
//     blur: [
//       1, 1, 1,
//       1, 1, 1,
//       1, 1, 1
//     ],
//     shadow: [
//       1, 2, 1,
//       0, 1, 0,
//       -1, -2, -1
//     ],
//     emboss: [
//       -2, 1, 0,
//       -1, 1, 1,
//       0, 1, 2
//     ],
//     edge: [
//       0, 1, 0,
//       1, -4, 1,
//       0, 1, 0
//     ]
//   };



//   constructor(private modelContainerService: ModelContainerService,
//     private dataTransmissionService: DataTransmissionService,
//     private olMapService: OlMapService,
//     private windowEventService: WindowEventService) {
//     this.AllLayer = new Array<any>();
//     this.canSelect = false;
//   }

//   initMap() {
//     //this.Layers.push(this.BingLayer);
//     //this.Layers.push(this.LayerOne);
//       this.Layers.push(this.untiled);
//     //this.Layers.push(this.tiled);


//     this.MapObject = new Map({
//       target: 'mapview',
//       layers: this.Layers,
//       view: new View({
//         center: [0, 0],
//         projection: this.projection,
//         zoom: 1
//       })
//     });

//     Proj.setProj4(proj4);
//     this.olMapService.initMapService(this.MapObject);
//     //test
//     this.olMapService.getImageWMSExtent().then(next => {
//     console.log(next)
//       this.MapObject.getView().fit(next);
//     }, error => {
//       console.log(error);
//     });

//     this.MapObject.on('singleclick', evt => {
//       var view = this.MapObject.getView();
//       var viewResolution = view.getResolution();
//       var source = this.tiled.getSource();
//       var url = source.getGetFeatureInfoUrl(
//         evt.coordinate, viewResolution, view.getProjection(),
//         { 'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50 });
//       if (url) {
//         this.olMapService.getPixelInfo(new URL(url)).then(res => {
//           //console.log(res);
//         })

//       }
//     });

//     //进行渲染
//     this.tiled.on('postcompose',ev=>{
//       //this.convolve(ev.context, this.kernels.none);
//     })
//     //准备渲染，未开始渲染
//     this.tiled.on('precompose',ev=>{
      
//       console.log('precompose')
//     })

//     // this.untiled.on('postcompose',ev=>{
//     //   this.convolve(ev.context, this.kernels.shadow);
//     // })
//     // //准备渲染，未开始渲染
//     // this.untiled.on('precompose',ev=>{
      
//     //   console.log('precompose')
//     // })




//     //设置地图要素选中
//     // a normal select interaction to handle click
//     this.select = new MapSelect({
//       layers: (layer) => {
//         //点选
//         if (this.canSelect) {
//           if (this.SelectedLayerId === layer.id) {
//             this.select.layer = layer;
//             return true;
//           } else {
//             return false;
//           }
//         } else {
//           return false;
//         }
//       },
//       style: null
//     });
//     let selectedFeatures = this.select.getFeatures();

//     // a DragBox interaction used to select features by drawing boxes
//     this.DragBox = new DragBox({
//       condition: KeyCondtion.platformModifierKeyOnly
//     });

//     //框选
//     this.DragBox.on('boxend', () => {
//       let extent = this.DragBox.getGeometry().getExtent();
//       if (this.AllLayer.length > 0) {
//         this.AllLayer.forEach(element => {
//           if (this.canSelect && element.getVisible() && element.id === this.SelectedLayerId) {

//             let CurrentLayer = element.getSource();
//             this.select.layer = element;
//             CurrentLayer.forEachFeatureIntersectingExtent(extent, function (feature) {
//               selectedFeatures.push(feature);
//             });
//             return;
//           }
//         })
//       }
//     });

//     // clear selection when drawing a new box and when clicking on the map
//     this.DragBox.on('boxstart', function () {
//       selectedFeatures.clear();
//     });


//     //绑定到map上
//     this.MapObject.addInteraction(this.select);
//     this.MapObject.addInteraction(this.DragBox);
//     this.DragBox.setActive(false);
//     this.MapObject.set('height', window.innerHeight * 0.88)
//   }

//   ngOnInit() {
//     //初始化变量
//     this.MouseMovePosition = new Point(0, 0);
//     this.MapHeight = window.innerHeight * 0.88;

//     this.initMap();



//     this.windowEventService.getWindowResizeSubject().subscribe(next => {
//       this.MapHeight = next.innerHeight * 0.88;
//     })

//     //初始化图层数组（因共享一个数据实例，故不用每次改变都请求）
//     this.AllLayer = this.olMapService.getAllLayers();

//     //订阅geoJson,添加到图层
//     this.dataTransmissionService.getGeoJson().subscribe(next => {
//       this.olMapService.addVectorLayer(next);
//     }, error => {
//       console.log(error);
//     })

//     // 图层的删除
//     this.dataTransmissionService.getDeleteLayerSubject().subscribe(layerId => {
//       this.olMapService.removeLayer( layerId);
//       this.SelectedLayerId = null;
//     })

//     //订阅是否显示或者隐藏图层
//     this.dataTransmissionService.getVisibleByIdSubject().subscribe(id => {
//       this.olMapService.showOrHideLayer( id, this.select, this.DragBox, this.canSelect);
//     }, error => {
//       console.log(error);
//     })

//     //订阅是否开启要素选择功能
//     this.dataTransmissionService.getFeatureSelectedSubject().subscribe(IsActive => {
//       this.canSelect = IsActive;

//       //如果是初次添加选中事件
//       if (this.canSelect) {
//         this.DragBox.setActive(true);
//       } else {
//         this.DragBox.setActive(false);
//       }
//     })

//     //订阅图层选中事件
//     this.dataTransmissionService.getLayerSelectedSubject().subscribe(LayerId => {
//       this.SelectedLayerId = LayerId;
//       // if (this.canSelect) {
//       //   this.select.setMap(this.MapObject);
//       // }


//     })

//     //订阅fullExtent事件
//     this.dataTransmissionService.getLayerFullExtentSubject().subscribe(LayerId => {
//       this.olMapService.setFullExtent( this.SelectedLayerId);
//     })

//     //订阅获取选中Feature的请求
//     this.dataTransmissionService.getReqAllSelectedFeaturesSubject().subscribe(() => {
//       this.dataTransmissionService.sendAllSelectedFeaturesSubject(this.select);
//     });

//     //mouse move
//     document.getElementsByClassName('ol-viewport')[0].addEventListener('pointermove', (ev) => {
//       let TempPosition = this.MapObject.getCoordinateFromPixel([ev.layerX, ev.layerY])
//       if (TempPosition) {
//         this.MouseMovePosition.x = TempPosition[0];
//         this.MouseMovePosition.y = TempPosition[1];
//         this.dataTransmissionService.sendMouseMoveAtMapSubject(this.MouseMovePosition);
//       }

//     })
//     //mouse out
//     document.getElementsByClassName('ol-viewport')[0].addEventListener('pointerout', (ev) => {
//       this.dataTransmissionService.sendMouseMoveAtMapSubject(null);
//     })

//   }

//   ngAfterViewInit() {
//     this.dataTransmissionService.sendUpdateProjectionSubject(this.MapObject.getView().getProjection());

//     this.MapObject.updateSize();
//   }

// }
