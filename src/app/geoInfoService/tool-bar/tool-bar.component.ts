import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataTransmissionService } from '../../_common'
@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Output()
  leftOpenState: EventEmitter<any> = new EventEmitter();
  SelectIsActive: boolean = false;
  IdentifyIsActive: boolean = false;

  leftOpen:boolean = false;
  constructor(private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {
    this.dataTransmissionService.getFeatureSelectedSubject().subscribe(SelectActive => {
      this.SelectIsActive = SelectActive;
    })
    this.dataTransmissionService.getIdentifySubject().subscribe(IdentifyActive => {
      this.IdentifyIsActive = IdentifyActive;
    })

  }

  leftSideToogle(){
    this.leftOpen = !this.leftOpen;
    this.leftOpenState.emit(this.leftOpen);
  }

}
