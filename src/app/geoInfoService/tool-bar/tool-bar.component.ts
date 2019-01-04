import { Component, OnInit } from '@angular/core';
import { DataTransmissionService } from '../../_common'
@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  SelectIsActive: boolean = false;
  IdentifyIsActive: boolean = false;
  constructor(private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {
    this.dataTransmissionService.getFeatureSelectedSubject().subscribe(SelectActive => {
      this.SelectIsActive = SelectActive;
    })
    this.dataTransmissionService.getIdentifySubject().subscribe(IdentifyActive => {
      this.IdentifyIsActive = IdentifyActive;
    })


  }

}
