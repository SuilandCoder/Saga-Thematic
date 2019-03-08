import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  logined:boolean = true;
  constructor() { }

  ngOnInit() {
  }

  signOut(){

  }
}
