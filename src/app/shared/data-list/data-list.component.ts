import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UserDataService } from 'src/app/_common/services/user-data.service';
import { DataInfo } from 'src/app/_common';

@Component({
  selector: 'share-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {

  @Input()
  userDatas:Array<DataInfo>;
  userDataContainerHeight: number;
  dataListHeight:number;
  constructor(
    private userDataService:UserDataService,
  ) {}

  ngOnInit() {
    this.userDataContainerHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.userDataContainerHeight = window.innerHeight * 0.9;
    })
    this.dataListHeight = 500;

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("data list:",changes);
    if (changes['userDatas'] && !changes['userDatas'].firstChange) {
    
    } 
  }


}
