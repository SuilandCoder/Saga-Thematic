import { Component, OnInit } from '@angular/core';
import { FieldToGetData } from 'src/app/_common/enum';
import { DataInfo } from 'src/app/_common';
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
  ) { }

  ngOnInit() {
    if (this.userService.isLogined) {
      this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId, { pageIndex: this.pageIndex, pageSize: this.pageSize }).subscribe({
        next: res => {
          if (res.error) {
            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
          } else {
            this.userDatas = res.data.content;
            this.dataLength = res.data.totalElements;
            console.log(res.data);
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
    this.userDataService.getDatas(FieldToGetData.BY_AUTHOR, this.userService.user.userId, { pageIndex: this.pageIndex, pageSize: this.pageSize }).subscribe({
      next: res => {
        if (res.error) {
          this.toast.warning(res.error, "Warning", { timeOut: 2000 });
        } else {
          this.userDatas = res.data.content;
          this.dataLength = res.data.totalElements;
          console.log(res.data);
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
