import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {
  Number_XY,
  DataTransmissionService
} from 'src/app/_common';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit, AfterViewInit {


  show: boolean;
  pos: Number_XY;
  bgColor: string;
  popupContent: Array<any>;
  private nameField: string;
  trangleBgColor: string;
  popupClass: string = "";
  @Input("pos")
  set setPos(pos: Number_XY) {
    if (pos) {
      this.pos = pos;
    } else {
      this.pos = new Number_XY(0, 0);
    }
  }
  get getPos() {
    return this.pos;
  }

  @Input("bgColor")
  set setBgColor(bgColor: string) {
    this.bgColor = bgColor;
  }
  get getBgColor() {
    return this.bgColor ? this.bgColor : '#fffff';
  }

  @Input("popupContent")
  set setContent(popupContent: Array<any>) {
    if (popupContent) {
      this.popupContent = popupContent;

    } else {
      this.popupContent = ["No command"];
    }
  }


  @Input("nameField")
  set setNameField(nameField: string) {
    this.nameField = nameField;
  }
  get getNameField() {
    return this.nameField ? this.nameField : null;
  }

  @Input("show")
  set onSetVisible(show: boolean) {
    if (show === null) {
      this.show = false;
    } else {
      this.show = show;
    }
  }



  @Output()
  onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  private ContainerElem: Element;
  private clickPos: Number_XY;


  constructor(private dataTransmissionService: DataTransmissionService) {
    this.clickPos = new Number_XY(0, 0);
  }

  ngOnInit() {

    //点击空白处取消 关闭弹框

    window.onclick = (ev) => {
      this.clickPos.setXY(ev.x, ev.y);
      this.onClosed.emit(this.show);
    }

    //resize 关闭弹框
    window.onresize = (ev) => {
      this.onClosed.emit(this.show);
    }
    //滚动，关闭弹窗
    window.onscroll = (ev) => {
      this.onClosed.emit(this.show);
    }

  }

  ngAfterViewInit() {
    let elem: HTMLElement = document.getElementsByClassName("popup-container")[0] as HTMLElement;
    if (this.pos) {

      //Angular的“单向数据流”规则禁止在一个视图已经被组合好之后再更新视图,所以等上1ms
      setTimeout(() => {
        if (window.innerWidth < this.pos.X + elem.clientWidth) {
          this.popupClass += "right-";
        } else {
          this.popupClass += "left-";
        }
        if (window.innerHeight < this.pos.Y + elem.clientHeight) {
          this.popupClass += "bottom";
        } else {
          this.popupClass += "top";
        }
        switch (this.popupClass) {
          case "left-top":
            this.trangleBgColor = "transparent " + this.bgColor + " transparent transparent";
            this.pos.setXY(this.pos.X + 20, this.pos.Y - 20);
            break;
          case "left-bottom":
            this.trangleBgColor = "transparent " + this.bgColor + " transparent transparent";
            this.pos.setXY(this.pos.X + 20, this.pos.Y - elem.clientHeight + 20);
            break;
          case "right-top":
            this.trangleBgColor = "transparent transparent transparent " + this.bgColor;
            this.pos.setXY(this.pos.X - elem.clientWidth - 20, this.pos.Y - 20);
            break;
          case "right-bottom":
            this.trangleBgColor = "transparent transparent transparent " + this.bgColor;
            this.pos.setXY(this.pos.X - elem.clientWidth - 20, this.pos.Y - elem.clientHeight + 20);
            break;
          default:
            break;
        }
      }, 1);
    }
  }

  onClick(item) {
    this.onSelected.emit(item);
  }

}
