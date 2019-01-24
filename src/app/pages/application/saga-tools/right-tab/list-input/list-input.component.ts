import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Input, Inject, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LayerItem, DataTransmissionService } from 'src/app/_common';
import { findIndex, remove, includes } from 'lodash';
import { UploadOutput } from 'ngx-uploader';

export interface DialogData {
  layerItems: Array<LayerItem>;
  type: string;
}

@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.scss']
})
export class ListInputComponent implements OnInit {
  @Input() layerItems: Array<LayerItem>;
  @Input() eventName: string;
  @Input() inputType: string;
  public layerListSubscription: Subscription;
  @Output() 
  inputData:EventEmitter<any> = new EventEmitter();
  public fileName:string="";



  constructor(
    public dialog: MatDialog,
    private dataTransmissionService: DataTransmissionService,
  ) { }

  ngOnInit() {
    // console.log("oninit："+this.inputType);
    if (this.inputType.includes("Grid")) {
      this.layerItems = this.layerItems.filter(item => {
        return item.type == "tif" || item.type == "sgrd";
      })
    } else if (this.inputType.includes("Shapes")) {
      this.layerItems = this.layerItems.filter(item => {
        return item.type == "shp";
      })
    }
    this.layerListSubscription = this.dataTransmissionService.getLayerListSubject().subscribe(layersArray => {
      this.layerItems = layersArray;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ListInputDialog, {
      width: '500px',
      data: { "layerItems": this.layerItems, "type": this.inputType },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("result:", result);
      //* 获取到用户选择的输入数据数组。 (key 为 LayerItem对象的 dataId)
      //* 根据数组内容，选取对应的 layerItems中的数据，返回至父组件
      let listData = {};
      let inputList: Array<LayerItem> = [];
      if (result&&result.length>0) {
        result.forEach(item => {
          let index = findIndex(this.layerItems, function (layer) {
            return layer.dataId == item.key;
          });
          if (index != -1) {
            inputList.push(this.layerItems[index]);
          }
        });
        listData["eventName"] = this.eventName;
        listData["layerList"] = inputList;
        let len = result.length;
        this.fileName = len+ "个文件";
        this.inputData.emit(listData);
      }
    });
  }

  ngAfterViewInit() {
    this.dataTransmissionService.sendReqAllLayerData();
  }


  private fileData={};
  private inputList:Array<LayerItem>=[];

  onUploadOutput(output: UploadOutput) {
    if(output.type === 'allAddedToQueue'){
      this.fileData["eventName"]=this.eventName;
      this.fileData["layerList"] = this.inputList;
      let len = this.inputList.length;
      this.fileName = len+ "个文件";
      this.inputData.emit(this.fileData);
      
    }else if(output.type === "addedToQueue"){
      if(output.file){
        let currentFile = output.file.nativeFile;
        let layerItem = new LayerItem(currentFile.name,currentFile);
        this.inputList.push(layerItem);
      }
    }else if(output.type === "start"){
      this.inputList = [];
    }
  }
}

export class Transfer {
  from: string;
  list: Array<any>;
  to: string;
}


@Component({
  selector: 'list-input-dialog',
  templateUrl: 'list-input-dialog.html'
})
export class ListInputDialog {
  list: any[] = [];
  rightList: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ListInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  ngOnInit(): void {
    let layerItems = this.data.layerItems;
    let type = this.data.type;
    layerItems.forEach(item => {
      if (type.includes("Grid") && (item.type == "tif" || item.type == "sgrd")) {
        this.list.push({
          key: item.dataId,
          title: item.name,
        })
      } else if (type.includes("Shapes") && item.type == "shp") {
        this.list.push({
          key: item.dataId,
          title: item.name,
        })
      }

    })
  }


  select(ret: Transfer): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: Transfer): void {
    console.log('nzChange', ret);
    if (ret.from == "left" && ret.to == "right") {
      this.rightList = this.rightList.concat(ret.list);
    } else if (ret.from == "right" && ret.to == "left") {
      remove(this.rightList, function (item) {
        return includes(ret.list, item);
      })
    }
    // console.log("rightList:", this.rightList);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
