import { Component, OnInit, Input } from '@angular/core';
import { ToolService } from 'src/app/_common/services/tool.service';
import { DataTransmissionService } from 'src/app/_common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  title = 'Geographic Information Service';
  LayersListHeight:number;
  leftBt = ">";
  rightBt = "<";
  @Input()
  leftOpened: boolean= true;
  @Input()
  rightOpened: boolean= false;
  @Input()
  right_tag = "";

  rightDock = false;
  showUploadList:boolean = false;
  showToolDialog = false;

  constructor(
    private toolService:ToolService,
    private dataTransmissionService:DataTransmissionService,
    private router:Router
  ) { 
    // this.router.events
    // .filter((event)=>event instanceof NavigationEnd)
    // .subscribe((event:NavigationEnd)=>{
    //   if(event.url==="/saga-tools"){
    //     this.LayersListHeight = window.innerHeight * 0.9;
    //     window.addEventListener('resize', () => {
    //       this.LayersListHeight = window.innerHeight * 0.9;
    //     })
    
    //     this.toolService.getModelInfoMessage().subscribe(_=>{ 
    //       this.right_tag = "des";
    //       this.rightOpened = true;
    //       this.rightDock = true;
    //     })
    
    //     this.toolService.getRightSideMessage().subscribe(_=>{
    //       this.rightOpened = !this.rightOpened;
    //     })
    
    //     this.dataTransmissionService.getUploadListControlSubject().subscribe(_=>{
    //       this.showUploadList = !this.showUploadList;
    //     })
    //   }
    // })
  }

  ngOnInit() {
    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    this.toolService.getModelInfoMessage().subscribe(_=>{ 
      this.right_tag = "des";
      // this.rightOpened = true;
      this.rightDock = true;
    })

    this.toolService.getRightSideMessage().subscribe(_=>{
      this.rightOpened = !this.rightOpened;
    })

    this.dataTransmissionService.getUploadListControlSubject().subscribe(_=>{
      this.showUploadList = !this.showUploadList;
    })

    this.dataTransmissionService.getToolDialogControlSubject().subscribe(open=>{
      if(open){
        this.showToolDialog = open;
      }else{
        this.showToolDialog = !this.showToolDialog;
      } 
    })

  }


  openStateHandler(event){
    this.leftOpened = event;
    if(!event){
      this.rightDock = event;
    }
  } 

  right_tab_toggle(event){
    if(event==this.right_tag){
      this.rightOpened = !this.rightOpened;
    }else{
      this.right_tag = event;
      this.rightOpened = true;
    } 
  }

}
