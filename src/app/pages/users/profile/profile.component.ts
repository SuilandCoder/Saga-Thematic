import { UserToolRecordComponent } from './user-tool-record/user-tool-record.component';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_common/services/user.service';
import { FieldToGetData } from 'src/app/_common/enum';
import { DataInfo, ToolRecord } from 'src/app/_common';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { UserDataListComponent } from './user-data-list/user-data-list.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild(UserDataListComponent) userDatalist: UserDataListComponent;
  @ViewChild(UserToolRecordComponent) userToolRecord:UserToolRecordComponent;
  profileHeight: number;
  user;
  constructor(
    private userService:UserService,
    private router: Router
  ) {
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .subscribe((event: NavigationEnd) => {
    // 这里需要判断一下当前路由，如果不加的话，每次路由结束的时候都会执行这里的方法，这里以search组件为例
     console.log("event url:"+event.url);
     if(this.userDatalist){
      this.userDatalist.getData();
     }
     if(this.userToolRecord){
      this.userToolRecord.ngOnInit();
     }
     
    });
   }

  ngOnInit() {
    this.profileHeight = window.innerHeight - 50;
    window.addEventListener('resize', () => {
      this.profileHeight = window.innerHeight - 50;
    })
    this.user = this.userService.user;
  }

}
