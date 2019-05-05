import { map } from 'rxjs/operators';
import { UserService } from './../../../../_common/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToolRecord } from 'src/app/_common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'user-tool-record',
  templateUrl: './user-tool-record.component.html',
  styleUrls: ['./user-tool-record.component.scss']
})
export class UserToolRecordComponent implements OnInit {
  toolRecordHeight:number;
  toolRecords: Array<ToolRecord>;
  constructor(
    private userService: UserService,
    private toast: ToastrService,
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
    this.toolRecordHeight = window.innerHeight*0.9-80;
    window.addEventListener('resize',()=>{
      this.toolRecordHeight = window.innerHeight*0.9-80;
    })

    //* 获取用户运行的模型记录
    if (this.userService.isLogined) {
      let userId = this.userService.user.userId;
      this.userService.getToolRecord(userId).subscribe({
        next: res => {
          if (res.error) {
            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
          } else {
            if(res.data){
              this.toolRecords = res.data.map(item => {
                let hasOutput = item.outputList.some(output => {
                  return output.dataId != "";
                })
                if (item.excuteState === 0) {
                  item.statusStr = "运行中";
                } else if (item.excuteState === 1 && hasOutput) {
                  item.statusStr = "成功";
                } else {
                  item.statusStr = "失败";
                }
                return item;
              })
              this.toolRecords.sort(this.compare);
              console.log("获取到用户运行的模型记录信息：", this.toolRecords);
            } 
          }
        },
        error: e => {
          console.log(e);
        }
      })
    }
  }

  trackByDataId(index:number,data:ToolRecord){
    return data.recordId;
  }

  compare(v1,v2){

    let date1 = new Date(v1.excuteTime);
    let date2 = new Date(v2.excuteTime);
    let num = date1.getTime()-date2.getTime();
    if(num>0){
      return -1;
    }else if(num<0){
      return 1;
    }else{
      return 0;
    }
  }

  getColor(status: string) {
    switch (status) {
      case "运行中":
        return '#2be0d1';
      case "成功":
        return 'green';
      case "失败":
        return 'red';
    }
  }

  downloadData(dataId:string){
    this.userService.downloadRecordData(dataId);
  }
}
