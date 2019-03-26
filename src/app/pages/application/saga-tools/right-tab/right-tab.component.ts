import { UserService } from 'src/app/_common/services/user.service';
import { DataInfo, ToolInfo } from 'src/app/_common/data_model/data-model';
import { UserDataService } from 'src/app/_common/services/user-data.service';

import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { ToolService } from 'src/app/_common/services/tool.service';
import { ToastrService } from 'ngx-toastr';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { ToolParam, DataTransmissionService, CustomFile } from 'src/app/_common';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import * as JSZip from 'jszip';
import { FieldToGetData } from 'src/app/_common/enum';


@Component({
  selector: 'app-right-tab',
  templateUrl: './right-tab.component.html',
  styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {
  subscription: Subscription;
  LayersListHeight: number;
  toolInfo;
  private inputParams: Array<ToolParam>;
  private outputParams: Array<ToolParam>;
  private optionsParams: Array<ToolParam>;
  private path: string = "json/modelInfo/climate_tools.json";
  private id = "9";
  private descriptionPath = "";
  private descriptionHtml = "";
  private userDatas: Array<DataInfo> = [];

  @Input() opened: boolean = false;
  @Input() tag: string = "";

  TabItems: Array<string>;
  constructor(
    private toolService: ToolService,
    public toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private dataTransmissionService: DataTransmissionService,
    private toast: ToastrService,
    private userDataService: UserDataService,
    private userService: UserService
  ) {
    console.log("rightTab");
  }

  ngOnInit() {
    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })
    this.TabItems = ['Description', 'Settings'];
    this.subscription = this.toolService.getModelInfoMessage().subscribe(({ path, id }) => {
      this.path = path;
      this.id = id;
      this.getDescpPathByJsonPath(path, id);
      console.log("path:" + path + "  id:" + id);
      this.toolService.getToolById(this.path, this.id).then(data => {
        console.log(data);
        this.toolInfo = data;
      }).catch(err => {
        console.log(err);
        this.toastr.error(err);
      });
    })
    if (this.userDataService.userDatas != null) {
      this.userDatas = this.userDataService.userDatas;
    }
  }

  onTabChanged(nzTabChangeEvent: NzTabChangeEvent) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['tag'] && !changes['tag'].firstChange) {
      if (changes['tag'].currentValue === 'data' && (this.userDataService.userDatas == null || this.userDataService.userDatas.length === 0)) {
        //*请求数据
        this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId).subscribe({
          next: res => {
            if (res.error) {
              this.toast.warning(res.error, "Warning", { timeOut: 2000 });
            } else {
              this.userDataService.userDatas = res.data;
              this.userDatas = res.data;
              console.log(res.data);
            }
          },
          error: e => {
            console.log(e);
          }
        });
      }
    }
  }

  rightSideToogle() {
    this.opened = !this.opened;
    this.toolService.sendRightSideMessage();
  }

  getDescpPathByJsonPath(path, id) {
    if (path) {
      var libraryName = path.substring(path.lastIndexOf("/") + 1, path.indexOf(".json"));
      this.descriptionPath = "assets/html/" + libraryName + "/" + libraryName + "_" + id + ".html";
      $.get(this.descriptionPath, data => {
        // console.log(data); 
        this.descriptionHtml = data;
      })
    }
  }

  truest(url) {
    console.log(123);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
        // this.dataTransmissionService.sendCustomFileSubject(new CustomFile(currentFile,Type));
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
            //* 将压缩文件上传至数据容器
            let dataInfo = new DataInfo();
            dataInfo.author = this.userService.user.userId;
            dataInfo.fileName = fileNameNoExt;
            dataInfo.suffix = suffix;
            dataInfo.type = type;
            dataInfo.file = currentFile;
            this.userDataService.uploadData(dataInfo).subscribe({
              next: res => {
                if (res.error) {
                  this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                } else {
                  this.userDatas.push(res.data);
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