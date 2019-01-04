import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  GeoData, postData, ToolIOData, LayerItem, LoadingInfo,
  HttpService,
  ModelService,
  DataTransmissionService
} from '../../_common';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.css']
})


export class ToolPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input("ToolId")
  public ToolId: any;
  public title: any;
  public selectedFilesArray;
  public selectedFiles;
  public AllRequestData: ToolIOData;
  public DataForPost: Map<string, LayerItem>;
  public inputDataArray: Array<GeoData>;
  public LayerItems: Array<LayerItem>;
  public LayerListSubscription: Subscription;
  public ReadySubscription: Subscription;

  public DataArrayInLayerList: any;

  onUploadOutput(ev: any, inputDataName: string) {
    if (ev.file) {
      let currentFile = ev.file.nativeFile;
      this.DataForPost.set(inputDataName, new LayerItem(currentFile.name, currentFile));
      this.checkInputState();
    }
  }

  public onInputItemSelected(item: LayerItem, inputDataName: string) {
    this.DataForPost.set(inputDataName, item.clone());
    this.checkInputState();
  }

  constructor(public toastr: ToastrService,
    private httpService: HttpService,
    private dataTransmissionService: DataTransmissionService,
    private modelService: ModelService) {
    this.DataForPost = new Map<string, LayerItem>();
    this.LayerItems = [];
  }

  ngOnInit() {
    this.inputDataArray = new Array<GeoData>();

    this.LayerListSubscription = this.dataTransmissionService.getLayerListSubject().subscribe(layersArray => {
      this.LayerItems = layersArray;
    })

    if (this.ToolId) {

      this.httpService.getModelInfo(this.ToolId).then(data => {
        this.AllRequestData = data;
        this.inputDataArray = data.input;
      }, (error => {
        this.toastr.error("request method failed.", "ERROR", {
          timeOut: 6000
        })
        console.log(error);
      }));

      this.ReadySubscription = this.dataTransmissionService.getReadySubject().subscribe(next => {
        this.onSubmit().then(res => {
          this.onRun(res);
        })
      })
    }
  }

  ngAfterViewInit() {
    this.dataTransmissionService.sendReqAllLayerData();
    this.dataTransmissionService.sendPreparedStateSubject(false);
  }

  checkInputState() {
    if (this.DataForPost.size === this.inputDataArray.length) {
      this.dataTransmissionService.sendPreparedStateSubject(true);
    }
  }

  onSubmit(): Promise<Map<string, LayerItem>> {
    return new Promise((resolve, reject) => {

      let postDataArray = new Array<postData>();
      this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(true, "uploading input data..."));
      //先将未上传的数据上传
      this.DataForPost.forEach((value, key) => {
        if (!value.uploaded) {
          postDataArray.push(
            new postData(this.AllRequestData.stateId,
              this.AllRequestData.stateName,
              this.AllRequestData.stateDesc,
              key, value.file));
        }
      })
      //如果有未上传的数据，则先上传
      if (postDataArray.length > 0) {
        this.httpService.uploadInputData(postDataArray).then((responseData) => {
          //上传完成之后，更改数据的上传状态
          responseData.forEach((value, index) => {
            let CurrentItem = this.DataForPost.get(value['Event']);
            // let gd_id = JSON.parse(value['ResponseData']['data'])['gd_id'];
            let gd_id = JSON.parse(value['ResponseData']['data'])['data'];
            CurrentItem.uploaded = true;
            CurrentItem.dataId = gd_id;
          })
          resolve(this.DataForPost);
        }, err => {
          reject(err);
        })
      } else {
        resolve(this.DataForPost);
      }
    })
  }

  onRun(responseData: Map<string, LayerItem>) {
    console.log("responseData: "+ responseData);
    this.dataTransmissionService.sendLoadingStateSubject(new LoadingInfo(true, "Calculating, please wait..."));
    this.httpService.runModel(this.ToolId, this.AllRequestData, responseData).then(msr_id => {
      this.onWaitModelRun(msr_id);
    }).catch(reason => {
      console.log(reason);
    })
  }

  onWaitModelRun(msr_id: string) {
    this.httpService.waitForResult(msr_id).then(data => {
      console.log(data);
    })
  }

  ngOnDestroy() {
    if (this.LayerListSubscription) this.LayerListSubscription.unsubscribe();
    if (this.ReadySubscription) this.ReadySubscription.unsubscribe();
  }

}
