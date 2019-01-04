import { Component, OnInit } from '@angular/core';
import { DataTransmissionService } from '../../_common'
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  private IsActive: boolean = false;
  constructor(private dataTransmissionService: DataTransmissionService) { }

  ngOnInit() {
  }
  onSelectedClick() {
    this.IsActive = !this.IsActive;
    this.dataTransmissionService.sendFeatureSelectedSubject(this.IsActive);
  }
}
