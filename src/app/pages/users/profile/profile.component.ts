import { UserDataService } from 'src/app/_common/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_common/services/user.service';
import { FieldToGetData } from 'src/app/_common/enum';
import { DataInfo, ToolRecord } from 'src/app/_common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileHeight: number;
  user;
  constructor(
    private userService:UserService
  ) { }

  ngOnInit() {
    this.profileHeight = window.innerHeight - 50;
    window.addEventListener('resize', () => {
      this.profileHeight = window.innerHeight - 50;
    })
    this.user = this.userService.user;
  }

}
