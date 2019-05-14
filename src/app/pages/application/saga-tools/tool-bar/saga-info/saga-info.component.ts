import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-saga-info',
  templateUrl: './saga-info.component.html',
  styleUrls: ['./saga-info.component.scss']
})
export class SagaInfoComponent implements OnInit {

  visibleCss:string;
  @Input()
  set displayInfo(show:any){
    this.visibleCss= show?"block":"none";
  }

  get displayInfo(){
    return this.visibleCss;
  }

  @Output()
  closeDialog = new EventEmitter<boolean>();

  dialogHeight;
  infoHeight;

  constructor() { 

  }

  ngOnInit() {
    this.dialogHeight = window.innerHeight*0.8;
    window.addEventListener('resize', () => {
      this.dialogHeight = window.innerHeight*0.8;
    })

    this.infoHeight = window.innerHeight*0.8-100;
    window.addEventListener('resize', () => {
      this.infoHeight = window.innerHeight*0.8-100;
    })
  }

  closeMyDialog(e){
    this.closeDialog.emit(e);
  }

}
