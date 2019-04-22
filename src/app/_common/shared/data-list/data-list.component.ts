import { DC_DATA_TYPE } from './../../enum/enum';
import { DataInfo } from 'src/app/_common/data_model/data-model';
import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { FieldToGetData } from 'src/app/_common/enum';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService, UtilService } from '../../services';
import * as _ from 'lodash';

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
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private dataTransmissionService: DataTransmissionService,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
    this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    window.addEventListener('resize', () => {
      this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    })
    this.loadUserData(this.userService.user.userId,{ asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });

    this.dataTransmissionService.getLoadUserDataSubject().subscribe(_=>{
      this.loadUserData(this.userService.user.userId,{ asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
    });
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

  loadUserData(userName:string,filter:any){
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, userName, filter).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          if (res.data.content) {
            this.userData = res.data.content;
            this.dataLength = res.data.totalElements;
            this.userData = this.userData.map(data => {
              if (data.type == DC_DATA_TYPE.SHAPEFILE) {
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } else if (data.type == DC_DATA_TYPE.GEOTIFF|| data.type==DC_DATA_TYPE.SDAT) {
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


  // addToLayer(dataInfo: DataInfo) {
  //   this.userDataervice.addToLayer(dataInfo);
  // }


  addToLayer(dataInfo: DataInfo) {
    console.log("添加至图层按钮被点击");
    //*判断是否为shp或geotiff格式
    if (dataInfo.type === DC_DATA_TYPE.GEOTIFF || dataInfo.type === DC_DATA_TYPE.SHAPEFILE || dataInfo.type===DC_DATA_TYPE.SDAT) {
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
          }
        })
      } else {
        //* 已发布，将数据添加至图层：
        this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
      }
    } else {
      this.toast.warning("Does not support this type.", "Warning", { timeOut: 2000 });
    }
  }

  onPageChange(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadUserData(this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] });
  }

  trackByDataId(index:number,data:DataInfo){
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
