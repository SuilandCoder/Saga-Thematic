import { ModelService } from './../../@core/data/model.service';
import { MenuService } from './../../@core/data/menu.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as $ from "jquery";
@Component({
  selector: 'app-models-info',
  templateUrl: './models-info.component.html',
  styleUrls: ['./models-info.component.scss']
})
export class ModelsInfoComponent implements OnInit {
  private library_info={};
  private modelList;
  constructor(
    private routeInfo:ActivatedRoute,
    private menuService: MenuService,
    private modelService: ModelService
    ) { }

  ngOnInit() {
    // this.jsonPath = this.routeInfo.snapshot.params['path'];
    this.routeInfo.params.forEach(params=>{
      //* 拿到路径
      let path = params['path'];

      //* 获取数据
      this.menuService.queryModelJson(path).then(library_info=>{
        this.library_info = library_info; 
      });
    }) 
  } 

  toModelInfoPage(info){
    // console.log(JSON.stringify(info));
    if(info.tool_path && info.tool_path!==""){
      window.open(info.tool_path);
    }else{
      this.modelService.queryModelPath(info.library_name,info.tool).subscribe(res=>{
        console.log(res);
      });
    } 
  }
}
