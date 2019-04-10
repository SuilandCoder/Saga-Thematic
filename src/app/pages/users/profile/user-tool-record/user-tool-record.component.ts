import { map } from 'rxjs/operators';
import { UserService } from './../../../../_common/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToolRecord } from 'src/app/_common';

@Component({
  selector: 'user-tool-record',
  templateUrl: './user-tool-record.component.html',
  styleUrls: ['./user-tool-record.component.scss']
})
export class UserToolRecordComponent implements OnInit {

  toolRecords: Array<ToolRecord>;
  constructor(
    private userService: UserService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
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
