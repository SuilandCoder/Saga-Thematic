import { Component, OnInit } from '@angular/core';
import { DataTransmissionService } from '../../_common';
@Component({
  selector: 'app-full-extent',
  templateUrl: './full-extent.component.html',
  styleUrls: ['./full-extent.component.css']
})
export class FullExtentComponent implements OnInit {

  constructor(private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {
  }

  onFullExtentClick() {
    this.dataTransmissionService.sendLayerFullExtentSubject();
  }
}
