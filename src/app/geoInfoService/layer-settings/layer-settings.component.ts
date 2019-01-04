import { Component, OnInit, AfterViewInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DataTransmissionService,
  LayerItem,
  ColorBand,
  LayerSetting,
  Number_XY,
  DataItem,
  OlMapService,
  WindowEventService
} from '../../_common';


@Component({
  selector: 'app-layer-settings',
  templateUrl: './layer-settings.component.html',
  styleUrls: ['./layer-settings.component.css']
})
export class LayerSettingsComponent implements OnInit, AfterViewInit, OnDestroy {

  GetAllLayerItemSubscription: Subscription;
  DialogMousePressedSubscription: any;
  DialogMouseMovedSubscription: any;

  AllLayersItem: Array<LayerItem>;
  AllLayersOnMap: any;
  CurrentColorBand: ColorBand;
  LayerSetting: LayerSetting;
  currentMoveDistance: Number_XY;
  xyDistance: Number_XY;
  CurrentLayerItem: LayerItem;

  TabList: Array<DataItem>;
  ActiveTab: string;

  @Input("LayerItem")
  set setLayerItem(layerItem: LayerItem) {
    this.CurrentLayerItem = layerItem;
  }

  @Output("onClosed")
  onClosed = new EventEmitter<any>();

  constructor(private dataTransmissionService: DataTransmissionService,
    private olMapService: OlMapService,
    private windowEventService: WindowEventService) {
    this.TabList = new Array<DataItem>();
  }


  ngOnInit() {
    this.ActiveTab = "0";

    this.GetAllLayerItemSubscription = this.dataTransmissionService.getLayerListSubject().subscribe(LayerItemArray => {
      this.AllLayersItem = LayerItemArray;

      if (this.CurrentLayerItem && this.CurrentLayerItem.isOnMap) {
        let a = this.AllLayersItem.find(value => {
          return value.dataId === this.CurrentLayerItem.dataId;
        })
        this.TabList.splice(0, this.TabList.length);
        this.TabList.push(new DataItem("0", "General"));

        this.TabList.push(new DataItem("1", "Style"));
        if (this.CurrentLayerItem.type === "shp") {
          this.TabList.push(new DataItem("2", "Labels"));
        }
        this.TabList.push(new DataItem("3", "Fields"));
        document.getElementById('ShowLayerSetting').click();

        this.LayerSetting = this.CurrentLayerItem.layerSetting;
      }

    })
    this.AllLayersOnMap = this.olMapService.getAllLayers();
    this.dataTransmissionService.sendReqAllLayerData();
    this.currentMoveDistance = new Number_XY(0, 110);



  }
  ngAfterViewInit() {
    //获取已经在地图上的图层
    //////for test





    //点击图层属性设置
    // this.dataTransmissionService.getLayerSettingSubject().subscribe(layerItem => {

    //   if (layerItem && layerItem.isOnMap) {
    //     let a = this.AllLayersItem.find(value => {
    //       return value.dataId === layerItem.dataId;
    //     })
    //     this.TabList.splice(0, this.TabList.length);
    //     this.TabList.push(new DataItem("0", "General"));

    //     this.TabList.push(new DataItem("1", "Style"));
    //     if (layerItem.type === "shp") {
    //       this.TabList.push(new DataItem("2", "Labels"));
    //     }
    //     this.TabList.push(new DataItem("3", "Fields"));
    //     document.getElementById('ShowLayerSetting').click();
    //     this.CurrentLayerItem = layerItem;
    //     //操作同一个图层则不进行实例化
    //     if (this.LayerSetting && this.LayerSetting.LayerItem.dataId === layerItem.dataId) {
    //     } else {
    //       this.LayerSetting = new LayerSetting(layerItem);
    //     }

    //   }
    // })






    //添加监听事件
    document.getElementById('LayerSettingModal').addEventListener('click', ev => {
      //判断模态框是否关闭,若关闭，则取消订阅
      let ClickedElem = ev.toElement;
      if (ClickedElem.hasAttribute('data-dismiss')) {
        setTimeout(() => {
          this.currentMoveDistance.setXY(0, 0);
          this.onClosed.emit();
        }, 1000);
      }
    })

  }




  onApply() {
    this.olMapService.applySetting(this.CurrentLayerItem);
  }

  onShowDialog() {
    //当鼠标按下时
    this.DialogMousePressedSubscription = this.windowEventService.getDialogMousePressedSubject().subscribe(mouseEventValue => {
      if (mouseEventValue.type === "MOUSEDOWN") {
        this.xyDistance = new Number_XY(0, 0);
      }
    })
    //当鼠标按下并移动时
    this.DialogMouseMovedSubscription = this.windowEventService.getDialogMouseMovedSubject().subscribe(xyDistance => {
      this.currentMoveDistance.setXY(xyDistance.X - this.xyDistance.X + this.currentMoveDistance.X,
        xyDistance.Y - this.xyDistance.Y + this.currentMoveDistance.Y);
      this.xyDistance = xyDistance;

    })
  }

  ngOnDestroy() {
    if (this.GetAllLayerItemSubscription) {
      this.GetAllLayerItemSubscription.unsubscribe();
    }
    if (this.DialogMousePressedSubscription) {

      this.DialogMousePressedSubscription.unsubscribe();
    }
    if (this.DialogMouseMovedSubscription) {

      this.DialogMouseMovedSubscription.unsubscribe();
    }


  }
}
