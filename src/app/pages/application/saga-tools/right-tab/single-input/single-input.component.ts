import { LayerItem } from 'src/app/_common/data_model/data-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataTransmissionService } from 'src/app/_common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-input',
  templateUrl: './single-input.component.html',
  styleUrls: ['./single-input.component.scss']
})
export class SingleInputComponent implements OnInit {
  @Input() layerItems:Array<LayerItem>;
  @Input() eventName:string;
  // public layerListSubscription: Subscription;
  layerItem:LayerItem;
  @Output() 
  inputData:EventEmitter<any> = new EventEmitter();
  constructor(
    private dataTransmissionService: DataTransmissionService,
  ) {}

  ngOnInit() {
  }

  onInputItemSelected(layer){
    this.layerItem = layer;
    let layerData ={};
    layerData["eventName"]=this.eventName;
    layerData["layerItem"] = layer;
    this.inputData.emit(layerData);
  }

  onUploadOutput(ev: any) {
    if (ev.file) {
      let currentFile = ev.file.nativeFile;
      let fileData={};
      fileData["eventName"]=this.eventName;
      this.layerItem = new LayerItem(currentFile.name, currentFile)
      fileData["layerItem"] = this.layerItem;
      this.inputData.emit(fileData);
    }
  }
}
