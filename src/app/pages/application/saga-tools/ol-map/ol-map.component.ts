import { Component, OnInit, AfterViewInit } from '@angular/core';
import proj4 from 'proj4';
import 'ol3-ext/dist/ol3-ext';
import 'setimmediate';
import {
  LayerItem,
  Point,
  ImageProcessing,
  ModifiedProjection,
  UtilService,
  OlMapService,
  WindowEventService,
  DataTransmissionService
} from 'src/app/_common';

declare var ol: any;

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.css']
})
export class OlMapComponent implements OnInit, AfterViewInit {
  private MapObject;
  private Layers: Array<any> = [];
  MapHeight: number;
  private SelectFlag: boolean;
  private select: any;
  IdentifyFlag: boolean;
  private identifyInfo: IdentifyInfo;
  private selectedFeatures: any;
  private DragBox: any;
  private SelectedLayerId: string;
  private MouseMovePosition: Point;
  private AllOnMapLayer: Array<any>;
  private AllLayers: Array<LayerItem>;
  private Popup: any;

  private styles = [
    'Road',
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabels',
    'collinsBart',
    'ordnanceSurvey'
  ];
  // private LayerOne = new ol.layer.Tile({
  //   source: new ol.source.OSM()
  // });

  private BingLayer = new ol.layer.Tile({
    preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'AjJc6AsekcsRocEYk3NhrXNYcAZaD9owLDe7pWr_lI0rT3lmdz0i3WQe7zIO3OcT',
      imagerySet: this.styles[2]
    })
  })

  private projection = new ol.proj.Projection({
    code: 'EPSG:2402',
    units: 'm',
    axisOrientation: 'neu',
    global: false
  });



  //raster test
  private format = 'image/png';
  // private untiled = new ol.layer.Image({
  //   source: new ol.source.ImageWMS({
  //     ratio: 1,
  //     url: 'http://172.21.212.119:8080/geoserver/ogms_ws/wms',
  //     params: {
  //       'FORMAT': this.format,
  //       'VERSION': '1.1.1',
  //       STYLES: '',
  //       LAYERS: 'ogms_ws:geotiff_chazhi',
  //     },
  //     crossOrigin: "anonymous"
  //   })
  // });

  // private tiled = new ol.layer.Tile({
  //   visible: true,
  //   source: new ol.source.TileWMS({
  //     url: 'http://172.21.212.119:8080/geoserver/ogms_ws/wms',
  //     params: {
  //       'FORMAT': this.format,
  //       'VERSION': '1.1.1',
  //       tiled: true,
  //       STYLES: '',
  //       LAYERS: 'ogms_ws:geotiff_chazhi',
  //       BGCOLOR: '0xffffff'
  //     }, crossOrigin: "anonymous"
  //   })
  // });


  constructor(
    private dataTransmissionService: DataTransmissionService,
    private olMapService: OlMapService,
    private windowEventService: WindowEventService,
    private imageProcessing: ImageProcessing,
    private utilService: UtilService) {
    this.AllOnMapLayer = new Array<any>();
    this.SelectFlag = false;
    this.identifyInfo = new IdentifyInfo(null, null);
  }

  ngOnInit() {
    //初始化变量
    this.MouseMovePosition = new Point(0, 0);
    this.MapHeight = window.innerHeight * 0.9;

    window.addEventListener('resize', () => {
      this.MapHeight = window.innerHeight* 0.9;
      setImmediate(()=>{
        //防止放在map实例化之后，不起效果
        this.MapObject.updateSize();
      })
    })

    this.initMap();

    //初始化图层数组（因共享一个数据实例，故不用每次改变都请求）
    this.AllOnMapLayer = this.olMapService.getAllLayers();

    // 图层的删除
    this.dataTransmissionService.getDeleteLayerSubject().subscribe(layerId => {
      this.olMapService.removeLayer(layerId);
      this.SelectedLayerId = null;
    })

    //订阅是否显示或者隐藏图层
    this.dataTransmissionService.getVisibleByIdSubject().subscribe(next => {
      this.olMapService.showOrHideLayer(next, this.select, this.DragBox, this.SelectFlag);
    }, error => {
      console.log(error);
    })

    //订阅是否开启要素选择功能
    this.dataTransmissionService.getFeatureSelectedSubject().subscribe(IsActive => {
      this.SelectFlag = IsActive;
      //如果是初次添加选中事件
      if (this.SelectFlag) {
        this.DragBox.setActive(true);
      } else {
        this.DragBox.setActive(false);
      }
    })

    this.dataTransmissionService.getIdentifySubject().subscribe(identifyFlag => {
      this.IdentifyFlag = identifyFlag;
    })

    //订阅图层选中事件
    this.dataTransmissionService.getLayerSelectedSubject().subscribe(LayerId => {
      this.SelectedLayerId = LayerId;
    })

    //订阅fullExtent事件
    this.dataTransmissionService.getLayerFullExtentSubject().subscribe(LayerId => {

      this.olMapService.setFullExtent(this.SelectedLayerId);
    })

    //订阅获取选中Feature的请求
    this.dataTransmissionService.getReqAllSelectedFeaturesSubject().subscribe(() => {
      if (this.SelectFlag) {
        this.dataTransmissionService.sendAllSelectedFeaturesSubject(this.select);
      } else {
        this.dataTransmissionService.sendAllSelectedFeaturesSubject(null);
      }

    });

    //获取所有的图层（在地图上+未在地图上的）
    this.dataTransmissionService.getLayerListSubject().subscribe(allLayers => {
      this.AllLayers = allLayers;
    })

    //更新图层的ZIndex
    this.dataTransmissionService.getLayerListOnSortSubject().subscribe(() => {
      this.AllOnMapLayer.forEach(LayerOnMap => {
        let findIndex = this.AllLayers.findIndex(value => {
          return value.dataId === LayerOnMap.id;
        })
        if (findIndex !== -1) {
          //倒序，位于列表最上方，则显示也在最上方
          LayerOnMap.setZIndex(this.AllLayers.length - findIndex - 1);
        }
      })
    })


    //mouse move
    document.getElementsByClassName('ol-viewport')[0].addEventListener('pointermove', (ev) => {
      let TempPosition = this.MapObject.getCoordinateFromPixel([ev.layerX, ev.layerY])
      if (TempPosition) {
        this.MouseMovePosition.x = TempPosition[0];
        this.MouseMovePosition.y = TempPosition[1];
        this.dataTransmissionService.sendMouseMoveAtMapSubject(this.MouseMovePosition);
      }
    })
    //mouse out
    document.getElementsByClassName('ol-viewport')[0].addEventListener('pointerout', (ev) => {
      this.dataTransmissionService.sendMouseMoveAtMapSubject(null);
    })
  }

  ngAfterViewInit() {
    this.dataTransmissionService.sendUpdateProjectionSubject(this.MapObject.getView().getProjection());
    this.MapObject.updateSize();
    this.dataTransmissionService.sendReqAllLayerData();
    console.log(this);
  }

  initMap() {
    //this.untiled.getSource().setImageLoadFunction(this.imageLoadFunction);
    //this.tiled.getSource().setTileLoadFunction(this.imageLoadFunction);
    //this.Layers.push(this.BingLayer);
    //this.Layers.push(this.LayerOne);
    //this.Layers.push(this.untiled);
    //this.Layers.push(this.tiled);
    //请求图像范围
    // this.olMapService.getImageWMSExtent().then(next => {
    //   this.MapObject.getView().fit(next);
    // }, error => {
    //   console.log(error);
    // });

    this.MapObject = new ol.Map({
      target: 'mapview',
      layers: this.Layers,
      view: new ol.View({
        center: [0, 0],
        zoom: 1
      })
    });

    this.olMapService.initMapService(this.MapObject);
    ol.proj.setProj4(proj4);

    //当View 改变时
    this.MapObject.setView = view => {
      if (view) {
        let Projection = view.getProjection();
        if (Projection) {
          this.dataTransmissionService.sendUpdateProjectionSubject(Projection);
          this.MapObject.set("view", view);
        }
      }
    }

    //当添加图层时
    let MapLayers = this.MapObject.getLayers();
    MapLayers.on('add', (event: any) => {
      this.dataTransmissionService.sendUpdateProjectionList(new ModifiedProjection(event.type, event.element));
      this.dataTransmissionService.sendLayerListOnSortSubject();
    })
    //当移除图层时
    MapLayers.on('remove', (event: any) => {
      //更新投影信息
      this.dataTransmissionService.sendUpdateProjectionList(new ModifiedProjection(event.type, event.element));
    })

    //当地图单击时
    this.MapObject.on('singleclick', evt => {
      this.dataTransmissionService.sendModifyProjectionListVisible(false);
    });

    //设置地图要素选中
    this.select = new ol.interaction.Select({
      layers: (layer) => {
        //点选
        if (this.SelectFlag || this.IdentifyFlag) {
          if (this.SelectedLayerId === layer.id) {
            this.select.layer = layer;
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      style: null
    });

    let selectedFeatures = this.select.getFeatures();
    selectedFeatures.on(['add'], () => {
      if (this.IdentifyFlag) {
        if (this.IdentifyFlag) {
          if (this.SelectedLayerId) {
            let currentLayer = this.olMapService.getLayerById(this.SelectedLayerId);
            let currentFeature = selectedFeatures.getArray()[0];
            this.identifyInfo = new IdentifyInfo(
              (currentFeature.getKeys() as Array<string>).filter(value => {
                return value !== 'geometry';
              }), currentFeature.getProperties()
            )
          }
        }
      }
    })
    selectedFeatures.on(['remove'], () => {
      if (this.IdentifyFlag) {
        this.identifyInfo = null;
      }

    })
    //框选
    this.DragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly
    });
    this.DragBox.on('boxstart', function () {
      selectedFeatures.clear();
    });
    this.DragBox.on('boxend', () => {
      let extent = this.DragBox.getGeometry().getExtent();
      if (this.AllOnMapLayer.length > 0) {
        this.AllOnMapLayer.forEach(element => {
          if (this.SelectFlag && element.getVisible() && element.id === this.SelectedLayerId) {

            let CurrentLayer = element.getSource();
            this.select.layer = element;
            CurrentLayer.forEachFeatureIntersectingExtent(extent, function (feature) {
              selectedFeatures.push(feature);
            });
            return;
          }
        })
      }
    });

    //绑定到map上
    this.MapObject.addInteraction(this.select);

    this.MapObject.addInteraction(this.DragBox);
    this.DragBox.setActive(false);
    this.MapObject.set('height', window.innerHeight * 0.88);
  }

  imageLoadFunction = (image, src) => {
    var img = new Image;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      var hTMLCanvasElement = document.createElement("canvas");
      hTMLCanvasElement.width = img.width;
      hTMLCanvasElement.height = img.height;
      var ctxt = hTMLCanvasElement.getContext("2d");
      ctxt.drawImage(img, 0, 0, img.width, img.height);

      //调用处理函数
      this.imageProcessing.convolve(ctxt, this.imageProcessing.kernels.sharpen);
      var type = 'jpeg';
      var imgDataUrl = hTMLCanvasElement.toDataURL(type);
      image.getImage().src = imgDataUrl;
    }
    img.src = src;
  }

  loadStaticTest() {

    let img = new Image;
    img.src = 'assets/images/dest_pro_img.bmp';
    //img.src = "http://imgsrc.baidu.com/baike/pic/item/738b4710b912c8fce0766602fd039245d7882173.jpg";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let staticImage = new ol.layer.Image({
        source: new ol.source.ImageStatic({
          projection: this.projection,
          imageExtent: [0, 0, img.width, img.height],
          imageLoadFunction: (image, src) => {
            var hTMLCanvasElement = document.createElement("canvas");
            hTMLCanvasElement.width = img.width;
            hTMLCanvasElement.height = img.height;

            var Context = hTMLCanvasElement.getContext("2d");
            Context.drawImage(img, 0, 0, img.width, img.height);

            //this.imageProcessing.convolve(Context,this.imageProcessing.kernels.shadow);

            // this.imageProcessing.convolve(Context, {
            //   data: [
            //    0, 0, 0,
            //     0, 1, 0,
            //     0, 0, 0
            //   ]
            // });

            var type = 'jpeg';
            var imgDataUrl = hTMLCanvasElement.toDataURL(type);


            image.getImage().src = img.src;
          }
        })
      })

      //重新设置范围
      var newExtent = [0, 0, img.width, img.height]
      var newView = new ol.View({
        projection: new ol.proj.Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: newExtent
        }),
        center: ol.extent.getCenter(newExtent),
        zoom: 2,
        maxZoom: 8
      })

      this.MapObject.setView(newView);

      this.MapObject.addLayer(staticImage);

    }
  }

  loadRasterTest() {

    let firstProjection1 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4326"]]';
    //var a =new proj4(firstProjection,[-71,41]);
    proj4.defs('WGS 84', firstProjection1);

    let newProjection = ol.proj.get("WGS 84");
    let newExtent = [121.0020617490000632, 46.0019821135000768, 121.5001713330000257, 46.3288665280000487];
    console.log(newProjection)
    let img = new Image;
    img.src = 'assets/images/dest_pro_img.bmp';
    //img.src = "http://imgsrc.baidu.com/baike/pic/item/738b4710b912c8fce0766602fd039245d7882173.jpg";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let staticImage = new ol.layer.Image({
        source: new ol.source.ImageStatic({
          projection: newProjection,
          imageExtent: newExtent,
          imageLoadFunction: (image, src) => {
            image.getImage().src = img.src;
          }
        })
      })

      //重新设置范围
      var newView = new ol.View({
        projection: newProjection,
        center: ol.extent.getCenter(newExtent),
        zoom: 2,
      })

      this.MapObject.setView(newView);
      this.MapObject.getView().fit(newExtent)
      this.MapObject.addLayer(staticImage);

    }
  }
}
class IdentifyInfo {
  FieldArray: Array<string>;
  ValueObject: any;
  constructor(
    FieldArray: Array<string>,
    ValueObject: any
  ) {
    this.FieldArray = FieldArray;
    this.ValueObject = ValueObject;
  }
}