import { LayerItem } from 'src/app/_common/data_model/data-model';
import { Component, OnInit,SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() inputType: string;
  public layerListSubscription: Subscription;
  layerItem:LayerItem;
  @Output() 
  inputData:EventEmitter<any> = new EventEmitter();
  myLayerItems:Array<LayerItem>;
  constructor(
    private dataTransmissionService: DataTransmissionService,
  ) {}

  ngOnInit() {
    if (this.inputType.includes("Grid")) {
      this.layerItems = this.layerItems.filter(item => {
        return item.type == "tif" || item.type == "sgrd";
      })
    } else if (this.inputType.includes("Shapes")) {
      this.layerItems = this.layerItems.filter(item => {
        return item.type == "shp";
      })
    } else if(this.inputType.includes("Table")){
      this.layerItems = this.layerItems.filter(item => {
        return item.type == "txt";
      })
    }  
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
