import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_common/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user:any;
  constructor(
    private userService:UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.user;
  }

}
