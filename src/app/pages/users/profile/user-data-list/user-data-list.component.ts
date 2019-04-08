import { Component, OnInit } from '@angular/core';
import { FieldToGetData } from 'src/app/_common/enum';
import { DataInfo, UtilService } from 'src/app/_common';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-data-list',
  templateUrl: './user-data-list.component.html',
  styleUrls: ['./user-data-list.component.scss']
})
export class UserDataListComponent implements OnInit {

  userDatas: Array<DataInfo>;
  pageIndex: number = 0;
  pageSize: number = 10;
  dataLength: number;
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
    private utilService:UtilService,
  ) { }

  ngOnInit() {
    if (this.userService.isLogined) {
      this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId, {pageIndex: this.pageIndex, pageSize: this.pageSize}).subscribe({
        next: res => {
          if (res.error) {
            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
          } else {
            this.userDatas = res.data.content;
            this.dataLength = res.data.totalElements;
            this.userDatas = this.userDatas.map(data=>{
              if(data.type=="SHAPEFILE"){
                data.meta = this.utilService.getShpMetaObj(data.meta);
              } 
              return data;
            })
            this.userDatas.sort(this.compare);
            console.log(this.userDatas);
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
  }

  onPageChange(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId, {pageIndex: this.pageIndex, pageSize: this.pageSize}).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          this.userDatas = res.data.content;
          this.dataLength = res.data.totalElements;
          this.userDatas = this.userDatas.map(data=>{
            if(data.type=="SHAPEFILE"){
              data.meta = this.utilService.getShpMetaObj(data.meta);
            } 
            return data;
          })
          this.userDatas.sort(this.compare);
          console.log(this.userDatas);
        }
      },
      error: e => {
        console.log(e);
      }
    });
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
