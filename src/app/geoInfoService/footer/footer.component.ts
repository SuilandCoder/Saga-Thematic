import { Component, OnInit } from '@angular/core';
import {
  Point,
  DataTransmissionService,
  OlMapService
} from '../../_common'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  CrsName: string;
  Coordinates: Point;
  Unit: string;
  ShowSwitchProjectionFlag: boolean;
  private StateInfo: string;
  StateShowFlag: boolean;
  constructor(private dataTransmissionService: DataTransmissionService,
    private olMapService: OlMapService) {

  }

  ngOnInit() {

    this.CrsName = "Unknown CRS";
    this.Unit = 'Unknown Unit';
    this.ShowSwitchProjectionFlag = false;
    this.StateShowFlag = false;
    this.dataTransmissionService.getMouseMoveAtMapSubject().subscribe(point => {
      if (point) {
        this.Coordinates = point;
      } else {
        this.Coordinates = null;
      }
    })
    this.dataTransmissionService.getUpdateProjectionSubject().subscribe(projection => {
      setTimeout(() => {
        if (projection) {
          this.CrsName = (projection.getCode() ? projection.getCode() : 'Unknown CRS');
          this.Unit = (projection.getUnits() ? projection.getUnits() : 'Unknown Unit');
        } else {
          this.CrsName = "Unknown CRS";
          this.Unit = 'Unknown Unit';
        }
      }, 1);

    })
    this.dataTransmissionService.getModifyProjectionListVisible().subscribe(visible => {
      this.ShowSwitchProjectionFlag = visible;
    })
    this.dataTransmissionService.getLoadingStateSubject().subscribe(loadingInfo => {
      this.StateShowFlag = loadingInfo.ShowFlag;
      this.StateInfo = loadingInfo.ShowInfo;
    })

  }
  switchProjection() {
    this.ShowSwitchProjectionFlag = !this.ShowSwitchProjectionFlag;
  }
  downloadMap() {
    this.olMapService.downloadMap();
  }

}
