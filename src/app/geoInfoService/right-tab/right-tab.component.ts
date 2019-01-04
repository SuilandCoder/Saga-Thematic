
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ModelService } from 'src/app/@core/data/model.service';
import { ToastrService } from 'ngx-toastr';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { ToolParam } from 'src/app/_common';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-right-tab',
  templateUrl: './right-tab.component.html',
  styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {
  subscription: Subscription;
  LayersListHeight: number;
  private toolInfo;
  private inputParams:Array<ToolParam>;
  private outputParams:Array<ToolParam>;
  private optionsParams:Array<ToolParam>;
  private path: string = "json/modelInfo/climate_tools.json";
  private id = "9";
  private descriptionPath = "";
  private descriptionHtml = "";
  TabItems: Array<string>;
  constructor(
    private modelService: ModelService,
    public toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.LayersListHeight = window.innerHeight * 0.88;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.88;
    })
    this.TabItems = ['Description', 'Settings'];
    this.subscription = this.modelService.getMessage().subscribe(({path,id})=>{
      this.path = path;
      this.id = id;
      this.getDescpPathByJsonPath(path,id);
      console.log("path:"+ path+"  id:"+id);
      this.modelService.getToolById(this.path, this.id).then(data => {
        console.log(data);
        this.toolInfo = data;
      }).catch(err => {
        console.log(err);
        this.toastr.error(err);
      });
    })
  }

  onTabChanged(nzTabChangeEvent: NzTabChangeEvent) {} 
  
  getDescpPathByJsonPath(path,id){
    if(path){
      var libraryName = path.substring(path.lastIndexOf("/") + 1, path.indexOf(".json"));
      this.descriptionPath = "../../../assets/html/"+libraryName+"/"+libraryName+"_"+id+".html";
      $.get(this.descriptionPath,data=>{
        // console.log(data); 
        this.descriptionHtml = data;
      })
    }
  }

  truest(url){
    console.log(123);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}