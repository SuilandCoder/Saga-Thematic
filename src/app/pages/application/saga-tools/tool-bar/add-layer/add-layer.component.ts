import { DataTransmissionService, CustomFile, DataInfo, UtilService } from 'src/app/_common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as JSZip from 'jszip';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { UserService } from 'src/app/_common/services/user.service';
@Component({
  selector: 'app-add-layer',
  templateUrl: './add-layer.component.html',
  styleUrls: ['./add-layer.component.css'],
})
export class AddLayerComponent implements OnInit {
  FileInputValue: string;
  constructor(
    private dataTransmissionService: DataTransmissionService,
    private toast: ToastrService,
    private userDataService: UserDataService,
    private userService: UserService,
    private utilService: UtilService,
  ) { }

  ngOnInit() {

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
        suffix = "txt";
        this.dataTransmissionService.sendCustomFileSubject(new CustomFile(currentFile, type));
      } else {
        JSZip.loadAsync(currentFile).then(data => {
          suffix = "zip";
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
          if (type !== "") {
            // this.dataTransmissionService.sendCustomFileSubject(new CustomFile(currentFile, Type));
            //* 将压缩文件上传至数据容器
            let dataInfo = new DataInfo();
            if(this.userService.isLogined){
              dataInfo.author = this.userService.user.userId;
            }else{
              dataInfo.author = "";
            }
            dataInfo.fileName = fileNameNoExt;
            dataInfo.suffix = suffix;
            dataInfo.type = type;
            dataInfo.file = currentFile;
            this.userDataService.uploadData(dataInfo).subscribe({
              next: res => {
                if (res.error) {
                  this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                } else {
                  let dataInfo:DataInfo = res.data;
                  console.log("上传数据成功");
                  this.userDataService.addToLayer(dataInfo);
                  this.userDataService.getMeta(res.data.id).subscribe({
                    next: metaRes => {
                      if (res.error) {
                        this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                      } else {
                        console.log("metaRes:", metaRes);
                        //* 判断是否是 shp 文件
                        if (dataInfo.type === "SHAPEFILE") {
                          let meta = metaRes.data;
                          dataInfo.meta = this.utilService.getShpMetaObj(meta);
                        }
                      }
                    },
                    error: e => {
                      console.log(e);
                    }
                  });
                }
              },
              error: e => {
                console.log(e);
              }
            });
            InputElement.value = ''; //清空文件列表，避免不能重复上传文件的情况
          } else {
            this.toast.warning("This type of file is not supported.", "Warning", { timeOut: 2000 });
          }
        }, error => {
          //not zip file 
          console.log(error);
          this.toast.warning("This type of file is not supported.", "Warning", { timeOut: 2000 });
        });
      }
    }
  }

  beforeFileUpload(e) {
    console.log('before: ' + e);
  }
}
