import { Component, OnInit } from '@angular/core';
import {
  OlMapService,
  ModifiedProjection,
  DataTransmissionService
} from '../../_common';
declare var ol: any;

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css']
})
export class ProjectionListComponent implements OnInit {

  ProjectionList: Array<any>;
  title: string;

  constructor(private dataTransmissionService: DataTransmissionService,
    private olMapService: OlMapService) {
    this.ProjectionList = new Array<any>();
    this.title = "Current Projections";
  }

  ngOnInit() {
    this.ProjectionList.push({
      id: "pre_code_epsg_3857",
      proj: {
        name: 'EPSG:3857',
        proj: 'null'
      }
    });
    this.dataTransmissionService.getUpdateProjectionList().subscribe(modifiedProjection => {
      this.modifyProjectionMap(modifiedProjection);
    })



  }

  modifyProjectionMap(modifiedProjection: ModifiedProjection) {
    if (modifiedProjection) {
      let CurrentLayer = modifiedProjection.layer;
      switch (modifiedProjection.type) {
        case "add":
          if (CurrentLayer) {
            this.ProjectionList.push(CurrentLayer);
          }
          break;
        case "remove":
          let findIndex = this.ProjectionList.findIndex(value => {
            return value.id === CurrentLayer.id;
          });
          if (findIndex !== -1) {
            this.ProjectionList.splice(findIndex, 1);
          }
          break;
        default:
          console.warn("unknown projection change.");
          break;
      }
    }
  }
  onProjectionItemClick(ProjectionItem: any) {
    let FindedLayer = this.olMapService.getLayerById(ProjectionItem);
    let Extent: Array<number>;
    if (!FindedLayer) {
      let Projection = ol.proj.get(ProjectionItem.proj.name);
      Extent = Projection.getExtent();
    } else {
      Extent = FindedLayer.getSource().getExtent();
    }
    this.olMapService.setProjection(ProjectionItem.proj.name, Extent);
    this.dataTransmissionService.sendModifyProjectionListVisible(false);
  }

}
