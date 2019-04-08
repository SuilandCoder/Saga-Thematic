import { DataInfo } from 'src/app/_common/data_model/data-model';
import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { FieldToGetData } from 'src/app/_common/enum';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService, UtilService } from '../../services';

@Component({
  selector: 'share-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {

  @Input()
  newData:DataInfo;
  userDatas: Array<DataInfo>;
  userDataContainerHeight: number;
  dataListHeight: number;
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private dataTransmissionService: DataTransmissionService,
    private cdr: ChangeDetectorRef,
    private utilService:UtilService,
  ) { }

  ngOnInit() {
    this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    window.addEventListener('resize', () => {
      this.userDataContainerHeight = window.innerHeight * 0.9 - 44;
    })
    // this.dataListHeight = 500;
    if (this.userService.isLogined) {
      this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId).subscribe({
        next: res => {
          if (res.error) {
            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
          } else {
            this.userDataService.userDatas = res.data;
            this.userDataService.userDatas.sort(this.compare);
            this.userDatas = this.userDataService.userDatas;
            this.userDatas = this.userDatas.map(data=>{
              if(data.type=="SHAPEFILE"){
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } 
              return data;
            })
            console.log("用户数据",this.userDatas);
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("数据列表变化",changes);
    if(changes["newData"]&&!changes["newData"].firstChange){
      let newData = changes["newData"].currentValue;
      this.userDatas.splice(0,0,newData);
      // this.cdr.markForCheck();
      // this.cdr.detectChanges();
      console.log("更新后的数据：",this.userDatas);
    } 
  }


  addToLayer(dataInfo:DataInfo){
    this.userDataService.addToLayer(dataInfo);
  }


  addToLayer_abandon(dataInfo: DataInfo) {
    console.log("添加至图层按钮被点击");
    //*判断是否为shp或geotiff格式
    if (dataInfo.type === "GEOTIFF" || dataInfo.type === "SHAPEFILE") {
      //*判断有没有发布服务
      if (!dataInfo.toGeoserver) {
        this.userDataService.dataToGeoServer(dataInfo.id).subscribe({
          next: res => {
            if (res.error) {
              this.toast.warning(res.error, "Warning", { timeOut: 2000 });
            } else {
              
              let data:string = res.data;
              let layerName = data.substring(data.indexOf('fileName:'),data.indexOf('发布成功'));
              dataInfo.layerName = layerName;
              dataInfo.toGeoserver = true;
              console.log("geoserver服务发布成功:",layerName);
              //* 发布成功，将数据添加至图层：
              this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
            }
          },
          error: e => {
            console.log(e);
          }
        })
      }else{
        //* 已发布，将数据添加至图层：
        this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
      }
    } else {
      this.toast.warning("Does not support this type.", "Warning", { timeOut: 2000 });
    } 
  }

  compare(v1,v2){ 
    let date1 = new Date(v1.createDate);
    let date2 = new Date(v2.createDate);
    let num = date1.getTime()-date2.getTime();
    if(num>0){
      return -1;
    }else if(num<0){
      return 1;
    }else{
      return 0;
    }
  }
}
