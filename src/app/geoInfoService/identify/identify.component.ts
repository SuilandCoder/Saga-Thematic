import { Component, OnInit } from '@angular/core';
import { DataTransmissionService } from '../../_common';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.css']
})
export class IdentifyComponent implements OnInit {


  private IsActive: boolean = false;
  constructor(private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {
  }
  onIdentifyClick() {
    this.IsActive = !this.IsActive;
    this.dataTransmissionService.sendIdentifySubject(this.IsActive);
  }
}
