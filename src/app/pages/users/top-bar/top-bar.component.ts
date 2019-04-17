import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goBack(){
    history.back();
  }
}
