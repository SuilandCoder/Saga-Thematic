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

enum DataSources {
  LOCAL = 1,
  LAYER_LIST = 2,
  USER_STORAGE = 3,
  DATA_CONTAINER = 4
}

export interface LayerData {
  layerItems: Array<LayerItem>;
  type: string;
  eventName: string;
  toolName: string;
  mdlId:string;
}

@Component({
  selector: 'app-data-pick',
  templateUrl: './data-pick.component.html',
  styleUrls: ['./data-pick.component.scss']
})
export class DataPickComponent {
  dataPicked: Array<DataInfo> = [];
  layerList: Array<DataInfo> = [];
  dataResources: Array<DataInfo> = null;
  dataSources: DataSources;
  toolName: string;
  inputDataList: Array<DataUploadInfo> = [];

  //*是否为 list 参数
  isInputList: boolean;

  eventName: string;

  @Input()
  searchContent: string = "";
  dataType: string;
  constructor(
    public dialogRef: MatDialogRef<DataPickComponent>,
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: LayerData
  ) { }

  ngOnInit(): void {
    let layerItems = this.data.layerItems;
    let type = this.data.type;
    this.eventName = this.data.eventName;
    this.toolName = this.data.toolName;
    if (type.includes('list')) {
      this.isInputList = true;
    } else {
      this.isInputList = false;
    }
    if (type.includes("Grid")) {
      this.dataType = "GEOTIFF";
    } else if (type.includes("Shapes")) {
      this.dataType = "SHAPEFILE";
    } else {
      this.dataType = "OTHER";
    }
    layerItems.forEach(item => {
      let dataItem = new DataInfo();
      dataItem.author = this.userService.user.userId;
      dataItem.file = item.file;
      dataItem.fileName = item.name;
      dataItem.tags.push(this.toolName);
      dataItem.mdlId = this.data.mdlId;
      if (item.type == "txt") {
        dataItem.suffix = item.type;
      } else {
        dataItem.suffix = "zip";
      }
      if (type.includes("Grid") && (item.type == "tif" || item.type == "sgrd")) {
        dataItem.type = "GEOTIFF";
        this.layerList.push(dataItem);
      } else if (type.includes("Shapes") && item.type == "shp") {
        dataItem.type = "SHAPEFILE";
        this.layerList.push(dataItem);
      }
    })
    this.fromUser();
  }

  fromLocal() {
    this.dataSources = DataSources.LOCAL;
  }
  fromLayers() {
    this.dataSources = DataSources.LAYER_LIST;
    this.dataResources = this.layerList;
  }


  fromUser() {
    this.dataSources = DataSources.USER_STORAGE;
    //! 判断是否登陆
    if (!this.userService.isLogined) {
      this.toast.warning("please login.", "Warning", { timeOut: 3000 });
      return;
    }
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          this.userDataService.userDatas = res.data;
          this.dataResources = res.data.filter(item => {
            return item.type == this.dataType;
          });
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          console.log(this.dataResources);
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  fromDataContainer() {
    this.dataSources = DataSources.DATA_CONTAINER;
    this.userDataService.getDatas(FieldToGetData.BY_MDL_ID, this.data.mdlId).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          if (res.data) {
            this.dataResources = res.data;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          }
          console.log(res.data);
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onUploadOutput(ev: any, InputElement: HTMLInputElement) {
    if (ev.file && ev.type === "addedToQueue") {
      let currentFile = ev.file.nativeFile;
      //* 判断传入的是否为压缩文件
      let fileName = currentFile.name;
      let type = "";
      let suffix = "";
      let zipExt = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
      let fileNameNoExt = fileName.substr(0, fileName.lastIndexOf("."));
      if (zipExt == "txt") {
        type = "OTHER";
        // this.dataTransmissionService.sendCustomFileSubject(new CustomFile(currentFile,Type));
      } else {
        suffix = "zip";
        JSZip.loadAsync(currentFile).then(data => {
          data.forEach((relativePath, file) => {
            let currentFileName: string = relativePath;
            let extName = currentFileName.substr(currentFileName.lastIndexOf('.') + 1).toLowerCase();
            switch (extName) {
              case "shp":
                type = "SHAPEFILE";
                break;
              case "tif":
                type = "GEOTIFF";
                break;
              case "sgrd":
                type = "OTHER";
                break;
              default:
                break;
            }
            if (type !== "") {
              return false;
            }
          });
          if (type == this.dataType) {
            //* 将压缩文件上传至数据容器
            let dataInfo = new DataInfo();
            dataInfo.author = this.userService.user.userId;
            dataInfo.fileName = fileNameNoExt;
            dataInfo.suffix = suffix;
            dataInfo.type = type;
            dataInfo.tags.push(this.toolName);
            dataInfo.mdlId = this.data.mdlId;
            dataInfo.file = currentFile;
            this.dataPicked.push(dataInfo);
            InputElement.value = ''; //清空文件列表，避免不能重复上传文件的情况
          } else {
            this.toast.warning("Please select " + `${this.dataType}` + " data.", "Warning", { timeOut: 2000 });
          }
        }, error => {
          //not zip file 
          console.log(error);
          this.toast.warning("This type of file is not supported.", "Warning", { timeOut: 2000 });
        });
      }
    }
  }

  pickData(item: DataInfo) {
    //* 判断所选类型是否正确
    if (item.type !== this.dataType) {
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

  search() {
    console.log("search");
    this.userDataService.getDatas(FieldToGetData.BY_FILE_NAME, this.searchContent).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          this.dataResources = res.data.filter(item => {
            return item.type == this.dataType;
          });
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          console.log(this.dataResources);
        }
      },
      error: e => {
        console.log(e);
      }
    });
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
}
