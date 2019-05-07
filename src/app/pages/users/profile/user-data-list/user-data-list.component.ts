import { Component, OnInit } from '@angular/core';
import { FieldToGetData, DC_DATA_TYPE } from 'src/app/_common/enum';
import { DataInfo, UtilService } from 'src/app/_common';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'user-data-list',
  templateUrl: './user-data-list.component.html',
  styleUrls: ['./user-data-list.component.scss']
})
export class UserDataListComponent implements OnInit {

  dataListHeight:number;
  userDatas: Array<DataInfo>;
  pageIndex: number = 0;
  pageSize: number = 10;
  dataLength: number;
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private utilService: UtilService,
    private router: Router
  ) { 
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
      // 这里需要判断一下当前路由，如果不加的话，每次路由结束的时候都会执行这里的方法，这里以search组件为例
       console.log("event url:"+event.url);
      });
  }

  ngOnInit() {
    this.dataListHeight = window.innerHeight*0.9-80;
    window.addEventListener("resize",()=>{
      this.dataListHeight = window.innerHeight*0.9-80;
    })

    if (this.userService.isLogined) {
      this.getData();
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

  getData(){
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId, { asc: false, pageIndex: this.pageIndex, pageSize: this.pageSize, properties: ["createDate"] }).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          if (res.data.content) {
            this.userDatas = res.data.content;
            this.dataLength = res.data.totalElements;
            this.userDatas = this.userDatas.map(data => {
              if (data.type == DC_DATA_TYPE.SHAPEFILE || data.type == DC_DATA_TYPE.SHAPEFILE_LIST) {
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } else if (data.type == DC_DATA_TYPE.GEOTIFF || data.type == DC_DATA_TYPE.SDAT || data.type==DC_DATA_TYPE.GEOTIFF_LIST || data.type==DC_DATA_TYPE.SDAT_LIST) {
                data.meta = this.utilService.getTiffMetaObj(data.meta);
              }
              return data;
            })
            // this.userDatas.sort(this.compare);
            console.log(this.userDatas);
          }
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  trackByDataId(index:number,data:DataInfo){
    return data.id;
  }

  onPageChange(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getData();
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
