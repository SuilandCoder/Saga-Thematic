import { UserService } from './../../../../../_common/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  logined:boolean = false;

  get username(){
    return this.userService.user.userId;
  }
  constructor(
    private userService:UserService,
    private router: Router
  ) { 
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
      // 这里需要判断一下当前路由，如果不加的话，每次路由结束的时候都会执行这里的方法，这里以search组件为例
        if (event.url === '/saga-tools') {
          /*在这写需要执行初始化的方法*/
          this.logined = this.userService.isLogined;
        }
      });
  }

  ngOnInit() {
    this.logined = this.userService.isLogined;
  }

  signOut(){
    this.userService.signOut();
    this.logined = false;
  }
}
