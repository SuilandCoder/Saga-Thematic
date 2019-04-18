import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  LayerItem,
  Number_XY,
  DataItem,
  LoadingInfo,
  GeoData,
  GeoJsonLayer,
  OlMapService,
  HttpService,
  UtilService,
  GlobeConfigService,
  DataTransmissionService,
} from 'src/app/_common'
import { TableInfo } from 'src/app/_common/data_model'
import { remove, isEqual } from 'lodash';
import * as _ from 'lodash';

declare var ol: any;
@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.css']
})

export class LayerListComponent implements OnInit, AfterViewInit {

  private SelectedLayerItemId: string;
  private SelectedLayerItem: LayerItem;
  LayerItems: Array<LayerItem> = [];
  private layerShowing = false;
  private LayersListHeight: number;
  private CurrentTabIndex: number;
  LayerListOptions: any;

  //popup
  private popupContent: Array<DataItem>;
  private nameField: string;
  private bgColor: string;
  private popupPos: Number_XY;
  popupShowed: boolean;
  clickItem: DataItem;

  constructor(private olMapService: OlMapService,
    private dataTransmissionService: DataTransmissionService,
    private httpService: HttpService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private globeConfigService: GlobeConfigService,
    private toast: ToastrService,
  ) {
    this.CurrentTabIndex = 0;
  }
  ngOnInit() {

    this.LayerListOptions = {
      animation: 150,
      onUpdate: () => {
        //update Zindex
        this.dataTransmissionService.sendLayerListOnSortSubject();
      }
    };


    // let that = this;
    //每次添加数据都会执行
    this.dataTransmissionService.getCustomFileSubject().subscribe(customFile => {
      let newItem = new LayerItem(customFile.file.name.substr(0, customFile.file.name.lastIndexOf('.')),
        customFile.file,
        customFile.type)
      this.LayerItems.splice(0, 0, newItem);
      // this.LayerItems.push(newItem);
      //* 添加到数组头部 
      // this.LayerItems=concat(newItem,this.LayerItems);

      //默认加载
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(true, "Loading layer to map,please waiting...."));
      this.changeLayerVisible(newItem);
    })

    //准备接收外部的获取layer list的请求
    this.dataTransmissionService.getReqAllLayerData().subscribe(next => {
      this.dataTransmissionService.sendLayerListSubject(this.LayerItems);
    })

    //轮询结果的返回
    this.dataTransmissionService.getModelRunRecord().subscribe(next => {
      let JsonObject = JSON.parse(next['data']);
      //! 此处 msr_output 是一个数组
      if (JsonObject &&
        JsonObject.data &&
        JsonObject.data.msr_output) {
        let output: Array<any> = JsonObject.data.msr_output;
        let hasOutput = false;
        console.log(output);
        output.forEach(item => {
          if (item && item.DataId && item.DataId != "" && item.Event) {
            hasOutput = true;
            this.dataTransmissionService.sendRemoteData(new GeoData(item.Event, "", 0, item.DataId));
          }
        });
        if (!hasOutput) {
          this.toastr.error("Run model failed.", "ERROR");
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        }
      } else {
        this.toastr.error("Run model failed.", "ERROR");
        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      }
    }, error => {
      console.log(error);
    })

    //获取远程数据
    this.dataTransmissionService.getRemoteData().subscribe(data => {
      // 获取数据类型
      this.httpService.getRemoteDataType(data.id).then(next => {
        if (next !== "UNKNOWN") {
          let newItem = new LayerItem(data.name, null, next, data.id);
          //* 防止一个数据被多次加载
          remove(this.LayerItems, item => {
            return isEqual(item, newItem);
          });
          if (this.olMapService.isDataOnLayer(data.id)) {
            return;
          }
          this.LayerItems.splice(0, 0, newItem);

          // this.LayerItems.push(newItem);
          //默认加载
          this.changeLayerVisible(newItem);
          this.toastr.success("Calculation completed.", "SUCCESS");
          // this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        } else {
          this.toastr.error("OUTPUT DATA TYPE UNKNOW.", "ERROR");
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        }
      }, error => {
        this.toastr.error("Error in getting data format.", "ERROR");
        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      })
    })

    //获取在线图层
    this.dataTransmissionService.getOnlineLayerSubject().subscribe(onlineLayerId => {
      this.dataTransmissionService.sendVisibleMapSubject(onlineLayerId);
      let findOnlineLayer: any = this.globeConfigService.onlineLayers.find(value => {
        return value["id"] === onlineLayerId;
      })
      let newItem = new LayerItem(findOnlineLayer.name, null, "ONLINE", onlineLayerId);
      if (this.olMapService.isDataOnLayer(onlineLayerId)) {
        return;
      }
      this.LayerItems.splice(0, 0, newItem);
      // this.LayerItems.push(newItem);
      // this.LayerItems=concat(newItem,this.LayerItems);
      //默认加载
      this.changeLayerVisible(newItem);
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
    }, error => {
      this.toastr.error(error, "ERROR");
    })

    this.LayersListHeight = window.innerHeight * 0.88;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.88;
    })

    this.dataTransmissionService.getTabIndexSwitchedSubject().subscribe(TabIndex => {
      this.CurrentTabIndex = TabIndex;
    })


    //* 模型容器geoserver做可视化
    this.dataTransmissionService.getMCGeoServerSubject().subscribe(geoserverDataInfo => {
      //* 新建 LayerItem对象，将 geoserverDataInfo 中的 id 暂时作为 dataId，用于唯一性识别方便图层添加及删除；

      //*获取文件类型
      let type = geoserverDataInfo.type === "GEOTIFF" ? "tif" : "shp";

      let newItem = new LayerItem(geoserverDataInfo.fileName, null, type, geoserverDataInfo.id);
      if (this.olMapService.isDataOnLayer(geoserverDataInfo.id)) {
        return;
      }
      if ((newItem.type == "shp" || newItem.type == "tif") && geoserverDataInfo.meta && geoserverDataInfo.meta.proj) {
        newItem.proj = geoserverDataInfo.meta.proj;
        if (geoserverDataInfo.meta.extent) {
          newItem.extent = geoserverDataInfo.meta.extent;
        }
        if (newItem.type == "shp" && geoserverDataInfo.meta.fields) {
          newItem.fields = geoserverDataInfo.meta.fields;
        }
      }
      this.LayerItems.splice(0, 0, newItem);
      newItem.visible = !newItem.visible;

      this.olMapService.addGeoserverLayer(newItem, geoserverDataInfo);
      newItem.isOnMap = true;
      newItem.layerShowing = false;
    });
    // this.dataTransmissionService.sendOnlineLayerSubject("TDT");
    this.dataTransmissionService.sendOnlineLayerSubject("osm");
  }

  ngAfterViewInit() {
    this.dataTransmissionService.sendReqAllLayerData();
  }

  onLayerItemClick(layerItem: LayerItem) {
    this.SelectedLayerItemId = layerItem.dataId;
    this.SelectedLayerItem = this.LayerItems.find((value) => value.dataId === this.SelectedLayerItemId);
    this.dataTransmissionService.sendLayerSelectedSubject(this.SelectedLayerItemId);

  }
  //当点击 显示/隐藏 图层的时候
  onEyeClicked(layerItem: LayerItem, e: Event) {
    this.changeLayerVisible(layerItem);
    e.stopPropagation();
  }

  //显示、隐藏图层
  changeLayerVisible(layerItem: LayerItem) {
    let currentItem = this.LayerItems.find((value) => value.dataId === layerItem.dataId && value.name === layerItem.name);
    //没有可供操作的数据
    if (!currentItem) {
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      return;
    }
    //没有该属性
    if (currentItem.isOnMap === undefined) {
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      return;
    }
    //! 已经在地图上
    if (currentItem.isOnMap) {
      currentItem.visible = !layerItem.visible;
      this.dataTransmissionService.sendVisibleByIdSubject(currentItem.dataId);
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      return;
    }
    //! 没有在地图上
    ////没有该属性
    if (undefined === currentItem.type) {
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      return;
    }
    //如果正在显示
    if (currentItem.layerShowing === true) {
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
      return;
    }
    //防止多次请求
    currentItem.layerShowing = true;
    //不同数据类型调用不同的展示方法
    switch (currentItem.type) {
      case "shp":
        this.httpService.getGeoJson(currentItem).then(data => {
          //* 如果 返回结果是 list, 从 layer-list remove layerItem, 重新添加每个list中的item.
          let resultData = data['data'];
          if (resultData instanceof Array) {
            remove(this.LayerItems, item => {
              return isEqual(item, currentItem);
            });
            resultData.forEach((item, i) => {
              currentItem = new LayerItem(layerItem.name + "_" + i, null, layerItem.type, data.Id);
              if (this.olMapService.isDataOnLayer(data.Id)) {
                return;
              }
              this.LayerItems.splice(0, 0, currentItem);
              // this.LayerItems.push(currentItem);
              // this.LayerItems=concat(currentItem,this.LayerItems);
              currentItem.visible = true;
              currentItem.dataPath = item.dataPath;
              this.olMapService.addVectorLayer(new GeoJsonLayer(currentItem.dataId, item));
              currentItem.isOnMap = true;
              currentItem.layerShowing = false;
            })
          } else {
            currentItem.visible = !layerItem.visible;
            //添加到olmap上
            currentItem.dataPath = data['data']['dataPath'];
            this.olMapService.addVectorLayer(new GeoJsonLayer(currentItem.dataId, data['data']));
            currentItem.isOnMap = true;
            currentItem.layerShowing = false;
          }
        }, reason => {
          remove(this.LayerItems, item => {
            return isEqual(item, currentItem);
          });
          currentItem.layerShowing = false;
          console.log(reason);
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          this.toastr.error("Failed to Load Data.");
        }).catch(error => {
          remove(this.LayerItems, item => {
            return isEqual(item, currentItem);
          });
          currentItem.layerShowing = false;
          this.toastr.error(error);
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        })
        break;
      case "sgrd":
        this.httpService.get_SGRD_ColorMap(currentItem).then(ResponseData => {
          if (ResponseData && ResponseData["code"] !== undefined) {
            if (ResponseData["code"] === 0) {
              let resultData = ResponseData['data'];
              if (resultData) {
                if (resultData instanceof Array) {
                  remove(this.LayerItems, item => {
                    return isEqual(item, currentItem);
                  });
                  resultData.forEach((item, i) => {
                    currentItem = new LayerItem(layerItem.name + "_" + i, null, layerItem.type, layerItem.dataId + i);
                    if (this.olMapService.isDataOnLayer(layerItem.dataId + i)) {
                      return;
                    }
                    this.LayerItems.splice(0, 0, currentItem);
                    // this.LayerItems.push(currentItem);
                    // this.LayerItems=concat(currentItem,this.LayerItems);
                    let imageLayer = this.utilService.ResDataToImageLayer(item);
                    imageLayer.id = currentItem.dataId;
                    this.olMapService.addImageLayer(imageLayer);
                    currentItem.visible = true;
                    currentItem.isOnMap = true;
                    currentItem.layerShowing = false;
                    currentItem.dataPath = item['dataPath'];
                  })
                  this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                } else {
                  let imageLayer = this.utilService.ResToImageLayer(ResponseData);
                  imageLayer.id = currentItem.dataId;
                  this.olMapService.addImageLayer(imageLayer);
                  currentItem.visible = !layerItem.visible;
                  currentItem.isOnMap = true;
                  currentItem.layerShowing = false;
                  currentItem.dataPath = ResponseData['data']['dataPath'];
                  this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                }
              } else {
                remove(this.LayerItems, item => {
                  return isEqual(item, currentItem);
                });
                this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                return;
              }
            } else {
              remove(this.LayerItems, item => {
                return isEqual(item, currentItem);
              });
              currentItem.layerShowing = false;
              this.toastr.error(ResponseData['msg']);
              this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
              return;
            }
          } else {
            remove(this.LayerItems, item => {
              return isEqual(item, currentItem);
            });
            this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
            return;
          }
        }).catch(error => {
          remove(this.LayerItems, item => {
            return isEqual(item, currentItem);
          });
          currentItem.layerShowing = false;
          this.toastr.error(error);
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        })
        break;
      case "tif":
        this.httpService.getColorMap(currentItem, null).then(ResponseData => {
          if (ResponseData && ResponseData["code"] !== undefined) {
            if (ResponseData["code"] === 0) {
              if (ResponseData['data']) {
                let imageLayer = this.utilService.ResToImageLayer(ResponseData);
                imageLayer.id = currentItem.dataId;
                if (this.olMapService.isDataOnLayer(currentItem.dataId)) {
                  return;
                }
                this.olMapService.addImageLayer(imageLayer);
                currentItem.visible = !layerItem.visible;
                currentItem.isOnMap = true;
                currentItem.layerShowing = false;
                currentItem.dataPath = ResponseData['data']['dataPath'];
                this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
              } else {
                remove(this.LayerItems, item => {
                  return isEqual(item, currentItem);
                });
                this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                return;
              }
            } else {
              remove(this.LayerItems, item => {
                return isEqual(item, currentItem);
              });
              currentItem.layerShowing = false;
              this.toastr.error(ResponseData['msg']);
              this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
              return;
            }
          } else {
            remove(this.LayerItems, item => {
              return isEqual(item, currentItem);
            });
            this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
            return;
          }
        }, reason => {
          console.log(reason);
          currentItem.layerShowing = false;
        }).catch(error => {
          remove(this.LayerItems, item => {
            return isEqual(item, currentItem);
          });
          currentItem.layerShowing = false;
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          this.toastr.error(error);
        })
        break;

      case "txt":
        //* 如果是加载本地数据，则不处理
        if (currentItem.file) {
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          break;
        }
        this.httpService.getTableFile(currentItem).then(response => {
          if (response && response['code'] != undefined) {
            if (response['code'] === 0) {
              if (response['data'] && response['data']['fieldArr'] && response['data']['fieldValue'] && response['data']['dataPath']) {
                let ti: TableInfo = new TableInfo();
                ti.fieldArr = response['data']['fieldArr'];
                ti.fieldVal = response['data']['fieldValue'];
                currentItem.dataPath = response['data']['dataPath'];
                currentItem.tableInfo = ti;
              } else {
                remove(this.LayerItems, item => {
                  return isEqual(item, currentItem);
                });
                this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
                return;
              }
            }
          }
        }, reason => {
          console.log(reason);
          currentItem.layerShowing = false;
        }).catch(error => {
          remove(this.LayerItems, item => {
            return isEqual(item, currentItem);
          });
          currentItem.layerShowing = false;
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          this.toastr.error(error);
        })
        break;
      case "ONLINE":
        currentItem.visible = !layerItem.visible;

        this.olMapService.addOnlineLayer(currentItem);
        currentItem.isOnMap = true;
        currentItem.layerShowing = false;
        break;
      default:
        this.toastr.warning("Unknown format.", "WARNING");
        break;
    }
  }

  //导出
  onExport(layerItem: LayerItem) {
    this.dataTransmissionService.sendExportDataSubject(layerItem);
  }

  //设置图层属性
  onLayerSetting(layerItem: LayerItem) {
    this.dataTransmissionService.sendLayerSettingSubject(layerItem);
  }
  //显示图层信息
  onLayerInfo(layerItem: LayerItem) {
    this.dataTransmissionService.sendLayerInfoSubject(layerItem);
  }

  //////popup//////////
  showPopup(layerItem: LayerItem, ev: MouseEvent) {
    //同一个再次点击则隐藏菜单
    if (this.SelectedLayerItemId === layerItem.dataId && this.popupShowed) {
      this.popupShowed = false;
    } else {
      //Angular的“单向数据流”规则禁止在一个视图已经被组合好之后再更新视图,所以等上1ms
      setTimeout(() => {
        //弹出菜单并选中
        this.SelectedLayerItemId = layerItem.dataId;

        //生成菜单内容
        this.popupContent = new Array<DataItem>();
        switch (layerItem.type) {
          case "tif":
            this.popupContent.push(new DataItem("EXPORT", "Export Data"));
            this.popupContent.push(new DataItem("REMOVE", "Remove"));
            this.popupContent.push(new DataItem("PROPERTIES", "Properties"));
            break;
          case "sgrd":
            this.popupContent.push(new DataItem("EXPORT", "Export Data"));
            this.popupContent.push(new DataItem("REMOVE", "Remove"));
            this.popupContent.push(new DataItem("PROPERTIES", "Properties"));
            break;
          case "shp":
            this.popupContent.push(new DataItem("TABLE", "Open Attributes Table"));
            this.popupContent.push(new DataItem("REMOVE", "Remove"));
            this.popupContent.push(new DataItem("EXPORT", "Export Data"));
            this.popupContent.push(new DataItem("PROPERTIES", "Properties"));
            break;
          case "ONLINE":
            this.popupContent.push(new DataItem("REMOVE", "Remove"));
            this.popupContent.push(new DataItem("PROPERTIES", "Properties"));
            break;
          case "txt":
            this.popupContent.push(new DataItem("REMOVE", "Remove"));
            this.popupContent.push(new DataItem("EDITTABLE", "Edit Table"));
            break;
          default:
            break;
        }
        this.nameField = "name";
        this.popupPos = new Number_XY(ev.x, ev.y);
        this.bgColor = "#fff";
        this.popupShowed = true;

        ev.stopPropagation();
      }, 1)

    }
  }

  onPopupItemSelected(dataItem: DataItem) {
    this.clickItem = dataItem;

    if (dataItem) {

      switch (dataItem.id) {
        case "REMOVE":
          //删除选中的item
          if (this.SelectedLayerItem) {
            this.LayerItems.splice(this.LayerItems.indexOf(this.SelectedLayerItem), 1);
            this.dataTransmissionService.sendDeleteLayerSubject(this.SelectedLayerItemId);
            this.SelectedLayerItemId = null;
          }
          break;
        case "TABLE":
          break;
        case "EXPORT":
          this.onExport(this.SelectedLayerItem);
          break;
        case "PROPERTIES":
          break;
      }
    }

  }

  onPopupClosed(showed: boolean) {
    setTimeout(() => { this.popupShowed = false; }, 1);
  }

  onClosed() {
    this.clickItem = null;
  }
  //////////按键事件/////////
  @HostListener('document:keyup', ['$event'])
  onkeydown(event: KeyboardEvent) {
    if (this.CurrentTabIndex === 0) {
      if (event.keyCode === 46) {
        //删除选中的item
        if (this.SelectedLayerItemId) {
          let findedItem = this.LayerItems.find((value) => value.dataId === this.SelectedLayerItemId);
          if (findedItem) {
            this.dataTransmissionService.sendDeleteLayerSubject(this.SelectedLayerItemId);
            this.LayerItems.splice(this.LayerItems.indexOf(findedItem), 1);
            this.SelectedLayerItemId = null;
          }
        }
      }
    }
  }
}
