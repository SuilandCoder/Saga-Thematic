import { ToolService } from '../../@core/data/tool.service';
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
  library_info:any={};
  private modelList;
  LayersListHeight: number;
  constructor(
    private routeInfo:ActivatedRoute,
    private menuService: MenuService,
    private toolService: ToolService
    ) { }

  ngOnInit() {
    this.LayersListHeight = window.innerHeight * 0.88;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.88;
    })
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
      this.toolService.queryModelPath(info.library_name,info.tool).subscribe(res=>{
        console.log(res);
      });
    } 
  }
}
