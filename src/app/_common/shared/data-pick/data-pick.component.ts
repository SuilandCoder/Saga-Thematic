import { DC_DATA_TYPE } from './../../enum/enum';
import { UserService } from 'src/app/_common/services/user.service';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { Inject } from '@angular/core';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as JSZip from 'jszip';
import 'rxjs/add/operator/map';
import { forkJoin } from "rxjs/observable/forkJoin";
import { LayerItem, DataInfo, DataUploadInfo } from '../../data_model';
import { FieldToGetData } from '../../enum';
import { UtilService, DataTransmissionService } from '../../services';

enum DataSources {
  LOCAL = 1,
  LAYER_LIST = 2,
  USER_STORAGE = 3,
  DATA_CONTAINER = 4
}

export interface LayerData {
  type: string;
  eventName: string;
  toolName: string;
  mdlId: string;
}

@Component({
  selector: 'app-data-pick',
  templateUrl: './data-pick.component.html',
  styleUrls: ['./data-pick.component.scss']
})
export class DataPickComponent {
  dataPicked: Array<DataInfo> = [];
  // layerList: Array<DataInfo> = [];
  dataResources: Array<DataInfo> = null;
  dataSources: DataSources;
  toolName: string;
  inputDataList: Array<DataUploadInfo> = [];

  //*是否为 list 参数
  isInputList: boolean;

  eventName: string;
  pageIndex: number = 0;
  pageSize: number = 12;
  dataLength: number;

  @Input()
  searchContent: string = "";
  dataType: string;
  constructor(
    public dialogRef: MatDialogRef<DataPickComponent>,
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private dataTransmissionService:DataTransmissionService,
    @Inject(MAT_DIALOG_DATA) public data: LayerData
  ) { }

  ngOnInit(): void {
    // let layerItems = this.data.layerItems;
    let type = this.data.type;
    this.eventName = this.data.eventName;
    this.toolName = this.data.toolName;
    if (type.includes('list')) {
      this.isInputList = true;
    } else {
      this.isInputList = false;
    }
    if (type.includes("Grid")) {
      this.dataType = DC_DATA_TYPE.GEOTIFF;
    } else if (type.includes("Shapes")) {
      this.dataType = DC_DATA_TYPE.SHAPEFILE;
    } else {
      this.dataType = DC_DATA_TYPE.OTHER;
    }
    // layerItems.forEach(item => {
    //   let dataItem = new DataInfo();
    //   dataItem.author = this.userService.user.userId;
    //   dataItem.file = item.file;
    //   dataItem.fileName = item.name;
    //   dataItem.tags.push(this.toolName);
    //   dataItem.mdlId = this.data.mdlId;
    //   if (item.type == "txt") {
    //     dataItem.suffix = item.type;
    //   } else {
    //     dataItem.suffix = "zip";
    //   }
    //   if (type.includes("Grid") && (item.type == "tif" || item.type == "sdat")) {
    //     dataItem.type = DC_DATA_TYPE.GEOTIFF;
    //     this.layerList.push(dataItem);
    //   } else if (type.includes("Shapes") && item.type == "shp") {
    //     dataItem.type = DC_DATA_TYPE.SHAPEFILE;
    //     this.layerList.push(dataItem);
    //   }
    // })
    this.fromUser();
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

  fromLocal() {
    this.dataSources = DataSources.LOCAL;
    this.dialogRef.close("on loading");
    this.dataTransmissionService.sendUploadListControlSubject();
    this.dataTransmissionService.sendToolDialogControlSubject();
  }

  getDatas(method:FieldToGetData,content:string){
    this.userDataService.getDatas(method, content, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] }).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          // this.userDataService.userDatas = res.data;
          this.dataLength = res.data.totalElements;
          if (res.data.content) {
            this.dataResources = res.data.content;
            this.dataResources = this.dataResources.map(data => {
              if (data.type == DC_DATA_TYPE.SHAPEFILE || data.type==DC_DATA_TYPE.SHAPEFILE_LIST) {
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } else if (data.type == DC_DATA_TYPE.GEOTIFF || data.type == DC_DATA_TYPE.SDAT || data.type==DC_DATA_TYPE.GEOTIFF_LIST || data.type==DC_DATA_TYPE.SDAT_LIST) {
                data.meta = this.utilService.getTiffMetaObj(data.meta);
              }
              return data;
            })
            this.cdr.markForCheck();
            this.cdr.detectChanges();
            // this.dataResources.sort(this.compare);
            console.log(this.dataResources);
          }
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }


  fromUser() {
    this.dataSources = DataSources.USER_STORAGE;
    //! 判断是否登陆
    if (!this.userService.isLogined) {
      this.toast.warning("please login.", "Warning", { timeOut: 3000 });
      return;
    }
    this.getDatas(FieldToGetData.BY_AUTHOR,this.userService.user.userId);
  }

  fromDataContainer() {
    this.dataSources = DataSources.DATA_CONTAINER;
    this.getDatas(FieldToGetData.BY_MDL_ID, this.data.mdlId);
  }

  search() {
    console.log("search");
    this.getDatas(FieldToGetData.BY_FILE_NAME, this.searchContent);
  }

  onPageChange(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    if(this.dataSources== DataSources.USER_STORAGE){
      this.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId);
    }else if(this.dataSources==DataSources.DATA_CONTAINER){
      this.getDatas(FieldToGetData.BY_FILE_NAME, this.searchContent);
    }
  }


  pickData(item: DataInfo) {
    //* 判断所选类型是否正确
    if((item.type==DC_DATA_TYPE.SHAPEFILE || item.type==DC_DATA_TYPE.SHAPEFILE_LIST)&&this.dataType!=DC_DATA_TYPE.SHAPEFILE){
      this.toast.warning("Please select " + `${this.dataType}` + " data.", "Warning", { timeOut: 2000 });
      return;
    }
    if((item.type==DC_DATA_TYPE.GEOTIFF || item.type==DC_DATA_TYPE.GEOTIFF_LIST || item.type==DC_DATA_TYPE.SDAT || item.type==DC_DATA_TYPE.SDAT_LIST)&&this.dataType!=DC_DATA_TYPE.GEOTIFF){
      this.toast.warning("Please select " + `${this.dataType}` + " data.", "Warning", { timeOut: 2000 });
      return;
    }
    if(item.type == DC_DATA_TYPE.OTHER && this.dataType != DC_DATA_TYPE.OTHER){
      this.toast.warning("Please select " + `${this.dataType}` + " data.", "Warning", { timeOut: 2000 });
      return;
    }
    //* 判断集合中是否已经存在
    if (this.dataPicked.indexOf(item) != -1) {
      this.toast.warning("Data have been selected.", "Warning", { timeOut: 2000 });
      return;
    }
    //* 判断是否需要输入 list 
    if (!this.isInputList && this.dataPicked.length == 1) {
      this.toast.warning("Only one input data is needed.", "Warning", { timeOut: 2000 });
      return;
    }
    this.dataPicked.push(item);
  }

  discard(item: DataInfo) {
    let discardIndex = this.dataPicked.indexOf(item);
    this.dataPicked.splice(discardIndex, 1);
  }


  upload() {
    //todo 关闭窗口，在 tool_setting 页面显示进度条

    //* 将选中的数据上传至数据容器
    //* 有的数据是已经存在容器中   根据sourceStoreId值来判断
    let datasNeedUpload = this.dataPicked.filter(item => {
      return !item.sourceStoreId;
    });

    let datasReady = this.dataPicked.filter(item => {
      return item.sourceStoreId;
    }).map(item => {
      let dataUploadInfo = new DataUploadInfo();
      dataUploadInfo.fileName = item.fileName;
      dataUploadInfo.sourceStoreId = item.sourceStoreId;
      dataUploadInfo.suffix = item.suffix;
      return dataUploadInfo;
    })

    let requestList = datasNeedUpload.map(data => {
      return this.userDataService.uploadData(data);
    });

    if (datasNeedUpload.length == 0) {
      console.log("没有要上传的数据");
      console.log("datasReady:", datasReady);
      this.inputDataList = datasReady;
      this.dialogRef.close("ready");
      let resultData = { "eventName": this.data.eventName, "dataList": this.inputDataList };
      this.userDataService.sendDataUploadResultSubjec(resultData);
      console.log("关闭对话框后的日志");
    } else {
      try {
        this.dialogRef.close("on loading");
        //* 并行上传所有数据，获取最后返回结果
        forkJoin(requestList).subscribe(results => {
          //* 获取返回结果
          console.log("result: ", results);
          let resultDatas = results.map(item => {
            let dataUploadInfo = new DataUploadInfo();
            dataUploadInfo.fileName = item.data.fileName;
            dataUploadInfo.sourceStoreId = item.data.sourceStoreId;
            dataUploadInfo.suffix = item.data.suffix;
            return dataUploadInfo;
          })

          //* 获取数据的 meta
          let getMetaList = results.map(item => {
            if (item.data.id) {
              return this.userDataService.getMeta(item.data.id);
            }
          })

          forkJoin(getMetaList).subscribe();

          console.log("resultDatas: ", resultDatas);
          this.inputDataList = resultDatas.concat(datasReady);
          console.log("inputDataList:" + this.inputDataList);
          let resultData = { "eventName": this.data.eventName, "dataList": this.inputDataList };
          this.userDataService.sendDataUploadResultSubjec(resultData);
          //todo 设置该输入条目数据
          //todo 取消进度条，显示已完成
        })
      } catch (error) {
        console.log(error);
        this.toast.warning("Failed to upload datas.", "Warning", { timeOut: 2000 });
      }
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
