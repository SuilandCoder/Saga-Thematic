import { UserService } from 'src/app/_common/services/user.service';
import { DataInfo, ToolInfo, ShpMeta } from 'src/app/_common/data_model/data-model';
import { UserDataService } from 'src/app/_common/services/user-data.service';

import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { ToolService } from 'src/app/_common/services/tool.service';
import { ToastrService } from 'ngx-toastr';
import { ToolParam, DataTransmissionService, CustomFile, UtilService } from 'src/app/_common';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import * as JSZip from 'jszip';
import { FieldToGetData, DC_DATA_TYPE } from 'src/app/_common/enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-right-tab',
  templateUrl: './right-tab.component.html',
  styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {
  subscription: Subscription;
  LayersListHeight: number;
  toolDesHeight: number;
  toolInfo;
  private inputParams: Array<ToolParam>;
  private outputParams: Array<ToolParam>;
  private optionsParams: Array<ToolParam>;
  private path: string = "json/modelInfo/climate_tools.json";
  private id = "9";
  private descriptionPath = "";
  descriptionHtml = "";
  private userDatas: Array<DataInfo> = [];
  newData: DataInfo;

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
    private userService: UserService,
    private utilService: UtilService,
  ) {
    console.log("rightTab");
  }

  ngOnInit() {
    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    this.toolDesHeight = window.innerHeight * 0.9 - 55;
    window.addEventListener('resize', () => {
      this.toolDesHeight = window.innerHeight * 0.9 - 55;
    })

    this.TabItems = ['Description', 'Settings'];
    // this.subscription = this.toolService.getModelInfoMessage().subscribe(({ path, id }) => {
    //   this.path = path;
    //   this.id = id;
    //   this.getDescpPathByJsonPath(path, id);
    //   console.log("path:" + path + "  id:" + id);
    //   this.toolService.getToolById(this.path, this.id).then(data => {
    //     console.log(data);
    //     this.toolInfo = data;
    //   }).catch(err => {
    //     console.log(err);
    //     this.toastr.error(err);
    //   });
    // })
    if (this.userDataService.userDatas != null) {
      this.userDatas = this.userDataService.userDatas;
    }
  }

  openMyDialog() {
    this.dataTransmissionService.sendUploadListControlSubject();
  }

  onTabChanged(nzTabChangeEvent) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['tag'] && !changes['tag'].firstChange) {
      if (changes['tag'].currentValue === 'data' && (this.userDataService.userDatas == null || this.userDataService.userDatas.length === 0)) {
        //*请求数据
        // this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId).subscribe({
        //   next: res => {
        //     if (res.error) {
        //       this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        //     } else {
        //       this.userDataService.userDatas = res.data;
        //       this.userDatas = res.data;
        //       this.userDatas = this.userDatas.map(data=>{
        //         if(data.type=="SHAPEFILE"){
        //           data.meta = this.utilService.getShpMetaObj(data.meta);
        //         } else if (data.type == "GEOTIFF") {
        //           data.meta = this.utilService.getTiffMetaObj(data.meta);
        //         }
        //         return data;
        //       })
        //       console.log(this.userDatas);
        //     }
        //   },
        //   error: e => {
        //     console.log(e);
        //   }
        // });
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
}