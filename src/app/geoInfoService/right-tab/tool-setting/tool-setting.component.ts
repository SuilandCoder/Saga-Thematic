import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ToolParam, HttpService, DataTransmissionService, LoadingInfo, LayerItem } from 'src/app/_common';
import * as $ from "jquery";
import { ModelService } from 'src/app/@core/data/model.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tool-setting',
  templateUrl: './tool-setting.component.html',
  styleUrls: ['./tool-setting.component.scss']
})
export class ToolSettingComponent implements OnInit {
  @Input() toolInfo;
  private inputParams: Array<ToolParam>;
  private outputParams: Array<ToolParam>;
  private optionsParams = [];
  private formData;
  public layerListSubscription: Subscription;
  public layerItems: Array<LayerItem>=[];
  public layerDataForPost:Map<string,LayerItem>;
  public layerListForPost:Map<string,Array<LayerItem>>;


  constructor(
    public modelService: ModelService,
    public toastr: ToastrService,
    private httpService: HttpService,
    private dataTransmissionService: DataTransmissionService,
    private cd: ChangeDetectorRef,
  ) {
    this.layerDataForPost = new Map<string,LayerItem>();
    this.layerListForPost = new Map<string,Array<LayerItem>>();
  }

  ngOnInit() {
    if (this.toolInfo["parameters"][0]) {
      this.inputParams = this.toolInfo["parameters"][0]["inputs"];
    }
    if (this.toolInfo["parameters"][1]) {
      this.outputParams = this.toolInfo["parameters"][1]["outputs"];
    }
    if (this.toolInfo["parameters"][2]) {
      var options = this.toolInfo["parameters"][2]["optionals"];
      this.setOptParams(options);
    }
    
    this.layerListSubscription = this.dataTransmissionService.getLayerListSubject().subscribe(layersArray => {
      this.layerItems = layersArray;
      this.layerItems.forEach(layer=>{
        console.log("layers",JSON.stringify(layer));
      })
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    try {
      if (changes['toolInfo'] && !changes['toolInfo'].firstChange) {
        this.layerDataForPost = new Map<string,LayerItem>();
        this.layerListForPost = new Map<string,Array<LayerItem>>();
        this.toolInfo = changes.toolInfo.currentValue;
        if (this.toolInfo["parameters"][0]) {
          this.inputParams = this.toolInfo["parameters"][0]["inputs"];
        } else {
          this.inputParams = [];
        }
        if (this.toolInfo["parameters"][1]) {
          this.outputParams = this.toolInfo["parameters"][1]["outputs"];
        } else {
          this.outputParams = [];
        }
        if (this.toolInfo["parameters"][2]) {
          var options = this.toolInfo["parameters"][2]["optionals"];
          this.setOptParams(options);
        } else {
          this.optionsParams = [];
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  ngAfterViewInit() {
    this.dataTransmissionService.sendReqAllLayerData();
    this.cd.detectChanges();
  }

  runModel() {
    this.formData = new FormData();
    this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(true, "Calculating, please wait..."));
    this.formData.append("oid", this.toolInfo.oid);
    this.formData.append("stateId", this.toolInfo.stateId);
    var inputAlready = false;
    inputAlready = this.setInputData();
    this.setOptionsData();
    if (inputAlready) {
      this.modelService.runSagaModel(this.formData).then(msr_id => {
        this.httpService.waitForResult(msr_id).then(data => {
          console.log(data);
        });
      }).catch(reason => {
        this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
        this.toastr.error("Run Model Failed.","error");
        console.log(reason);
      })
    } else {
      this.toastr.error("Data Not Ready");
    }
  }

  inputDataHandler(event){
    this.layerDataForPost.set(event["eventName"],event["layerItem"]);
  }

  inputListHandler(event){
    this.layerListForPost.set(event["eventName"],event["layerList"]);
  }
  
  setInputData() {
    var len = $("#input_body tr").length;
    for (var i = 0; i < len; i++) {
      let type = this.inputParams[i].type;
      let eventName = this.inputParams[i].identifier;
      
      //* 如果输入数据为list数据
      if(type.includes("list")){
        let layerList = this.layerListForPost.get(eventName);
        if((layerList==null || layerList.length==0) && this.inputParams[i].optional == "false" ){
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          return false;
        }else if(layerList!=null && layerList.length>0){
          let pathList = [];
          layerList.forEach(layer=>{
            if(layer.dataPath){
              pathList.push(layer.dataPath);
            }else if(layer.file){
              this.formData.append(eventName,layer.file);
            }
          })
          if(pathList.length>0){
            this.formData.append(eventName,pathList);
          }
        }
      }else{
        let layerItem = this.layerDataForPost.get(eventName);
        if (layerItem==null && this.inputParams[i].optional == "false" ) {
          this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(false));
          return false;
        }else if(layerItem){
          //*从layerlist中取数据作为输入数据
          if(layerItem.dataPath){
            this.formData.append(eventName,layerItem.dataPath);
          }else if(layerItem.file){
            this.formData.append(eventName,layerItem.file);
          }
        }
      }
    }
    return true;
  }

  setOptionsData() {
    if (this.optionsParams.length != 0) {
      // var json = [];
      var row = {};
      var index = 0;

      var this_tmp = this;
      // var optionsParams = this.optionsParams;
      $("#options_body").find("tr").each(function () {
        // var row = {};
        //判断类型是否为choice
        var number;
        if (this_tmp.optionsParams[index].type == "Choice") {
          number = $(this).children().eq(2).find("select option:selected").val();
        } else {
          number = $(this).children().eq(2).find("input").val();
        }
        row[this_tmp.optionsParams[index].identifier] = number;
        // json.push(row);

        index++;
      });
      var data = JSON.stringify(row);
      this.formData.append("control", data);
    }
  }

  setOptParams(options) {
    this.optionsParams = [];
    options.forEach(option => {
      var optParam = {};
      var constraints = option.constraints;
      optParam['name'] = option.name;
      optParam['constraints'] = constraints;
      var default_d = constraints.substring(constraints.indexOf("Default: ") + 9);
      optParam['default_d'] = default_d;
      optParam['type'] = option.type;
      optParam['identifier'] = option.identifier;
      if (option.type == "Choice") {
        var cons_mid = constraints.substring(constraints.indexOf("\n") + 1, constraints.lastIndexOf("\n"));
        var op_datas = cons_mid.split("\n");
        optParam["op_datas"] = op_datas;
      }
      this.optionsParams.push(optParam);
    });
  }

}
