import { ModelService } from './../../../@core/data/model.service';
import { Component, OnInit, Input, Output } from '@angular/core';
import {EventEmitter} from '@angular/core'//正确的

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss']
})
export class PhotoCardComponent implements OnInit {
  @Input() public library_info={};

  @Output() toModelInfoPage:EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private modelService:ModelService,
  ) { }

  ngOnInit() {
  }

  toModelInfoPage_child(library_name,tool,tool_path){
    this.toModelInfoPage.emit({library_name,tool,tool_path});
  }

}
