import { Component, OnInit, Input } from '@angular/core';
import { ToolService } from 'src/app/_common/services/tool.service';

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

  rightDock = false;

  constructor(
    private toolService:ToolService
  ) { 

  }

  ngOnInit() {

    this.LayersListHeight = window.innerHeight * 0.9;
    window.addEventListener('resize', () => {
      this.LayersListHeight = window.innerHeight * 0.9;
    })

    this.toolService.getModelInfoMessage().subscribe(_=>{ 
      this.rightOpened = true;
      this.rightDock = true;
    })

    this.toolService.getRightSideMessage().subscribe(_=>{
      this.rightOpened = !this.rightOpened;
    })
  }


  openStateHandler(event){
    this.leftOpened = event;
    if(!event){
      this.rightDock = event;
    }
  } 
}