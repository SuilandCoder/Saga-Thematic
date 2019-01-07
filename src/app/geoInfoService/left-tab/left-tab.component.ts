import { NzTabChangeEvent } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core'; 
import { WindowEventService, DataTransmissionService } from '../../_common/';

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
    private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {

    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    this.TabItems = ['Layers', 'Data','Tools'];
    this.ActiveTabItemIndex = 0;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(0);

  }

  onTabChanged(nzTabChangeEvent: NzTabChangeEvent) {
    this.ActiveTabItemIndex = nzTabChangeEvent.index;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(this.ActiveTabItemIndex);
  }


}
