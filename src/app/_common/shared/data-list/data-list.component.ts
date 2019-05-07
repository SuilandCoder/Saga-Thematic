import { LayerItem } from './../../data_model/data-model';
import { DC_DATA_TYPE, VISIBLE_STATUS } from './../../enum/enum';
import { DataInfo } from 'src/app/_common/data_model/data-model';
import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { FieldToGetData } from 'src/app/_common/enum';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService, UtilService } from '../../services';
import * as _ from 'lodash';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'share-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {

  @Input()
  newData: DataInfo;
  userData: Array<DataInfo>;
  pageIndex: number = 0;
  pageSize: number = 12;
  dataLength: number;
  userDataContainerHeight: number;
  allLayers: Array<LayerItem>;
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private dataTransmissionService: DataTransmissionService,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private router: Router,
  ) {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        // 这里需要判断一下当前路由，如果不加的话，每次路由结束的时候都会执行这里的方法，这里以search组件为例
        if (event.url === '/saga-tools') {
          /*在这写需要执行初始化的方法*/
          this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
          window.addEventListener('resize', () => {
            this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
          })

          if (this.userService.user) {
            this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
          }

          this.dataTransmissionService.getLoadUserDataSubject().subscribe(_ => {
            this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
          });

          this.dataTransmissionService.getAddToLayerSubject().subscribe(dataInfo => {
            this.userData = this.updateData(dataInfo, this.userData);
          })

          this.dataTransmissionService.getLayerListSubject().subscribe(allLayers => {
            this.allLayers = allLayers;
          })
        }
      });
  }


  ngOnInit() {
    this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    window.addEventListener('resize', () => {
      this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    })

    if (this.userService.user) {
      this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
    }

    this.dataTransmissionService.getLoadUserDataSubject().subscribe(_ => {
      this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
    });

    this.dataTransmissionService.getAddToLayerSubject().subscribe(dataInfo => {
      this.userData = this.updateData(dataInfo, this.userData);
    })

    this.dataTransmissionService.getLayerListSubject().subscribe(allLayers => {
      this.allLayers = allLayers;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("数据列表变化", changes);
    if (changes["newData"] && !changes["newData"].firstChange) {
      let newData = changes["newData"].currentValue;
      this.userData.splice(0, 0, newData);
      // this.cdr.markForCheck();
      // this.cdr.detectChanges();
      console.log("更新后的数据：", this.userData);
    }
  }


  getSrc(item: DataInfo) {
    let img_path = "";
    if (item.type == DC_DATA_TYPE.SHAPEFILE || item.type == DC_DATA_TYPE.SHAPEFILE_LIST) {
      if (item.meta) {
        if (item.meta[0].geometry == 'MultiPoint' || item.meta[0].geometry == 'Point') {
          img_path = "assets/images/data/points-vector.png";
        } else if (item.meta[0].geometry == 'MultiLineString' || item.meta[0].geometry == 'LineString') {
          img_path = "assets/images/data/line-vector.png";
        } else if (item.meta[0].geometry == 'MultiPolygon' || item.meta[0].geometry == 'Polygon') {
          img_path = "assets/images/data/polygon-vector.png";
        } else if (item.meta[0].geometry == 'GeometryCollection' || item.meta[0].geometry == 'Geometry') {
          img_path = "assets/images/data/vector.png";
        } else {
          img_path = "assets/images/data/vector.png";
        }
      } else {
        img_path = "assets/images/data/vector.png";
      }
    } else if (item.type == DC_DATA_TYPE.GEOTIFF || item.type == DC_DATA_TYPE.GEOTIFF_LIST || (item.type == DC_DATA_TYPE.SDAT || item.type == DC_DATA_TYPE.SDAT_LIST)) {
      img_path = "assets/images/data/tiff.png";
    } else if (item.type == DC_DATA_TYPE.OTHER) {
      img_path = "assets/images/data/other.png";
    }
    return img_path;
  }
  setClasses(item: DataInfo) {
    if (item.type == DC_DATA_TYPE.SHAPEFILE || item.type == DC_DATA_TYPE.SHAPEFILE_LIST) {
      return {"shp_img":true};
    }
  }

  loadUserData(userName: string, filter: any) {
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, userName, filter).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          if (res.data.content) {
            this.userData = res.data.content;
            this.dataLength = res.data.totalElements;
            this.userData = this.userData.map(data => {
              if (data.type == DC_DATA_TYPE.SHAPEFILE || data.type == DC_DATA_TYPE.SHAPEFILE_LIST) {
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } else if (data.type == DC_DATA_TYPE.GEOTIFF || data.type == DC_DATA_TYPE.SDAT || data.type == DC_DATA_TYPE.GEOTIFF_LIST || data.type == DC_DATA_TYPE.SDAT_LIST) {
                data.meta = this.utilService.getTiffMetaObj(data.meta);
              }
              return data;
            })
            // this.userData.sort(this.compare);
            console.log(this.userData);
          }
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }


  addToLayer(dataInfo: DataInfo) {
    console.log("添加至图层按钮被点击");
    //* 判断是否已经位于图层中
    if (this.allLayers) {
      let onLayerList: boolean = this.allLayers.some(item => {
        return item.dataId === dataInfo.id || item.dataId.includes(dataInfo.id);
      })
      if (onLayerList) {
        this.toast.warning("Already shown on the map.", "Warning", { timeOut: 2000 });
        return;
      }
    }
    dataInfo.visibleStatus = VISIBLE_STATUS.ON_LOADING;
    this.userData = this.updateData(dataInfo, this.userData)
    //*判断是否为shp或geotiff格式
    if (dataInfo.type === DC_DATA_TYPE.GEOTIFF || dataInfo.type === DC_DATA_TYPE.SHAPEFILE ||
       dataInfo.type === DC_DATA_TYPE.SDAT || dataInfo.type === DC_DATA_TYPE.GEOTIFF_LIST ||
       dataInfo.type === DC_DATA_TYPE.SHAPEFILE_LIST||dataInfo.type === DC_DATA_TYPE.SDAT_LIST) {
      //*判断有没有发布服务
      if (!dataInfo.toGeoserver) {
        this.userDataService.dataToGeoServer(dataInfo.id).subscribe({
          next: res => {
            if (res.error) {
              this.toast.warning(res.error, "Warning", { timeOut: 2000 });
            } else {
              dataInfo = res.data;
              this.userData = this.updateData(dataInfo, this.userData)
              console.log("geoserver服务发布成功:", dataInfo.layerName);
              //* 发布成功，将数据添加至图层：
              this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
            }
          },
          error: e => {
            console.log(e);
            this.toast.warning("Something wrong.", "Warning", { timeOut: 2000 });
            dataInfo.visibleStatus = VISIBLE_STATUS.NOT_VISIBLE;
          }
        })
      } else {
        //* 已发布，将数据添加至图层：
        this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
      }
    } else {
      this.toast.warning("Does not support this type.", "Warning", { timeOut: 2000 });
      dataInfo.visibleStatus = VISIBLE_STATUS.NOT_VISIBLE;
    }
  }

  onPageChange(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
  }

  trackByDataId(index: number, data: DataInfo) {
    return data.id;
  }

  updateData(dataItem: DataInfo, dataList: Array<DataInfo>) {
    console.log("更新前：", dataList);
    let index = _.findIndex(dataList, ["id", dataItem.id]);
    if (index >= 0) {
      dataItem.meta = dataList[index].meta;
      dataList.splice(index, 1, dataItem);
      console.log("更新后：", dataList);
      return dataList;
    } else {
      return dataList;
    }
  }

  compare(v1, v2) {
    let date1 = new Date(v1.createDate);
    let date2 = new Date(v2.createDate);
    let num = date1.getTime() - date2.getTime();
    if (num > 0) {
      return -1;
    } else if (num < 0) {
      return 1;
    } else {
      return 0;
    }
  }
}
