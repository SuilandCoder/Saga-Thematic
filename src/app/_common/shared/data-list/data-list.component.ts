import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { DataInfo } from 'src/app/_common';
import { FieldToGetData } from 'src/app/_common/enum';
import { UserService } from 'src/app/_common/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'share-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {

  @Input()
  userDatas: Array<DataInfo>;
  userDataContainerHeight: number;
  dataListHeight: number;
  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private toast: ToastrService,
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log("data list:", changes);
    if (changes['userDatas'] && !changes['userDatas'].firstChange) {

    }
  }
}
