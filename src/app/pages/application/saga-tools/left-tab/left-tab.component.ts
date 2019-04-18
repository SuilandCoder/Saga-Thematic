import { NzTabChangeEvent } from 'ng-zorro-antd';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WindowEventService, DataTransmissionService, GlobeConfigService } from 'src/app/_common';

@Component({
  selector: 'app-left-tab',
  templateUrl: './left-tab.component.html',
  styleUrls: ['./left-tab.component.css']
})
export class LeftTabComponent implements OnInit {
  opened: boolean = true;
  LayersListHeight: number;
  TabItems: Array<string>;
  ActiveTabItemIndex: number;
  onlineLayers: Array<any>;


  @Output()
  leftOpenState: EventEmitter<any> = new EventEmitter();
  constructor(
    private windowEventService: WindowEventService,
    private dataTransmissionService: DataTransmissionService,
    private globeConfigService: GlobeConfigService,
    ) {
    console.log("leftTab");
  }

  ngOnInit() {

    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    this.onlineLayers = this.globeConfigService.onlineLayers;

    // this.TabItems = ['Layer', 'Output','Tool'];
    this.TabItems = ['Tool', 'Layer', 'Output'];
    this.ActiveTabItemIndex = 0;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(0);

  }

  onTabChanged(nzTabChangeEvent: NzTabChangeEvent) {
    this.ActiveTabItemIndex = nzTabChangeEvent.index;
    this.dataTransmissionService.sendTabIndexSwitchedSubject(this.ActiveTabItemIndex);
  }

  leftSideToogle() {
    this.opened = !this.opened;
    this.leftOpenState.emit(this.opened);
  }

  addOnlineLayer(layer: any) {
    console.log(layer);
    this.dataTransmissionService.sendOnlineLayerSubject(layer.id);
  }

  addOnlineLayer_test(id:string){
    this.dataTransmissionService.sendOnlineLayerSubject(id);
  }

  onFullExtentClick() {
    this.dataTransmissionService.sendLayerFullExtentSubject();
  }

}
