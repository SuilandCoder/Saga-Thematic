import { NzTabChangeEvent } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core'; 
import { WindowEventService, DataTransmissionService } from 'src/app/_common';

@Component({
  selector: 'app-left-tab',
  templateUrl: './left-tab.component.html',
  styleUrls: ['./left-tab.component.css']
})
export class LeftTabComponent implements OnInit {
  LayersListHeight: number;
  TabItems: Array<string>;
  ActiveTabItemIndex: number;
  constructor(private windowEventService: WindowEventService,
    private dataTransmissionService: DataTransmissionService) {
      console.log("leftTab");
     }

  ngOnInit() {

    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    // this.TabItems = ['Layer', 'Output','Tool'];
    this.TabItems = ['Tool','Layer','Output'];
    this.ActiveTabItemIndex = 0;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(0);

  }

  onTabChanged(nzTabChangeEvent: NzTabChangeEvent) {
    this.ActiveTabItemIndex = nzTabChangeEvent.index;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(this.ActiveTabItemIndex);
  }


}
