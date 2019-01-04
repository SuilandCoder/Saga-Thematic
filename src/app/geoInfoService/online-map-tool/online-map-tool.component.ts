import { Component, OnInit } from '@angular/core';
import { GlobeConfigService, DataTransmissionService } from '../../_common';

@Component({
  selector: 'app-online-map-tool',
  templateUrl: './online-map-tool.component.html',
  styleUrls: ['./online-map-tool.component.css']
})
export class OnlineMapToolComponent implements OnInit {

  onlineLayers: Array<any>;

  constructor(private globeConfigService: GlobeConfigService,
    private dataTransmissionService: DataTransmissionService) {
    this.onlineLayers = this.globeConfigService.onlineLayers;
  }


  ngOnInit() {
  }

  addOnlineLayer(layer: any) {
    this.dataTransmissionService.sendOnlineLayerSubject(layer.id);
  }

}
