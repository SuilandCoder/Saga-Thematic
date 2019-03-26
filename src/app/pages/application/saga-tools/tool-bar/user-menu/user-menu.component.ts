import { UserService } from './../../../../../_common/services/user.service';
import { Component, OnInit } from '@angular/core';

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
    private userService:UserService
  ) { 
    
  }

  ngOnInit() {
    this.logined = this.userService.isLogined;
  }

  signOut(){
    this.userService.signOut();
    this.logined = false;
  }
}
