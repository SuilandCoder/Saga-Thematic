import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LayerItem, UtilService, OlMapService } from 'src/app/_common';
import { UserDataService } from 'src/app/_common/services/user-data.service';



@Component({
  selector: 'app-attributes-table',
  templateUrl: './attributes-table.component.html',
  styleUrls: ['./attributes-table.component.css']
})
export class AttributesTableComponent implements OnInit {

  CurrentLayerItem: LayerItem;
  isVisible: boolean;
  title: string = "Attributes Table";
  fieldArray: Array<string>;
  fieldValues: Array<any> = [];
  itemWidth: number;
  scrollX: number;

  rows = [];
  @Input("LayerItem")
  set setLayerItem(layerItem: LayerItem) {
    this.CurrentLayerItem = layerItem;
  }

  @Input('attrTableVisible')
  set _visible(value: boolean) {
    this.isVisible = value;
  }

  @Output("onClosed")
  onClosed = new EventEmitter<any>();


  constructor(private utilService: UtilService,
    private olMapService: OlMapService,
    private userDataService:UserDataService,
    ) {
    this.rows = [
      {
        'GRID_CODE': 'dasdsa',
        'POINTID': 'id'
      }
    ]
  }

  ngOnInit() {

    let LayerOnMap = this.olMapService.getLayerById(this.CurrentLayerItem.dataId);
    if(this.CurrentLayerItem.type=='txt'){
      //* 模型返回的table数据
      if(this.CurrentLayerItem.tableInfo){
        this.fieldArray = this.CurrentLayerItem.tableInfo.fieldArr;
        this.fieldValues = this.CurrentLayerItem.tableInfo.fieldVal;
      }else{
        //* 本地加载的 table数据
        this.utilService.getTableFieldArray(this.CurrentLayerItem.file,(fieldArr,valuesArr)=>{
          this.fieldArray = fieldArr;
          this.fieldValues = valuesArr;
        });
      } 
    }else{
      //* 从feature中取得
      // this.fieldArray = this.utilService.getFieldArray(LayerOnMap);
      // this.fieldValues = this.utilService.getFieldValue(LayerOnMap);

      this.fieldArray = this.CurrentLayerItem.fields.map((item:any)=>{
        return item.field;
      });
      let id = this.CurrentLayerItem.dataId.substring(0,this.CurrentLayerItem.dataId.lastIndexOf("_"));
      this.userDataService.getShpDBF(id).subscribe({
        next: res=>{
          if(res.error){
            console.error(res.error);
          }else{
            this.fieldValues = res.data;
          }
        },
        error: e=>{
          console.error(e);
        }
      })


    } 
    this.itemWidth = 100;
    this.scrollX = this.fieldArray.length * this.itemWidth + 400;

  }
  handleOk = (ev) => {
    this.onClosed.emit(ev);
  }

  handleCancel = (ev) => {
    this.onClosed.emit(ev);
  }
  onCancelClick(ev) {
    this.onClosed.emit(ev);
  }

}
