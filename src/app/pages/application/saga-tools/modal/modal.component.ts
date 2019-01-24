
/**
 *该组件在ng-zorro-antd 的nz-modal基础上，删减了一些当前用不到的功能，额外增加可拖动功能.
 *   
 */

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Number_XY } from 'src/app/_common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit {

  _cancelText: string;
  _isVisible: boolean;
  _okText: string;
  _style: any;
  _title: string;

  _footerTpl: TemplateRef<void>;
  _content: '';
  _contentTpl: TemplateRef<void>;
  _width: number;

  //如果外部传了模板，则使用外部的模板，否则使用内置的模板
  @Input('modalFooter')
  set nzFooter(value: TemplateRef<void> | boolean) {
    if (value instanceof TemplateRef) {
      this._footerTpl = value;
    }
  }
  @Input('modalContent')
  set nzContent(value: TemplateRef<void> | boolean) {
    if (value instanceof TemplateRef) {
      this._contentTpl = value;
    }
  }
  @Input('cancelText')
  set setCancelText(value: string) {
    this._cancelText = value || 'cancel';
  }
  @Input('okText')
  set setOkText(value: string) {
    this._okText = value || 'ok';
  }
  @Input('visible')
  set modalVisible(value: boolean) {
    this._isVisible = value || false;
  }
  @Input('title')
  set modalTitle(value: string) {
    this._title = value || 'No Title';
  }
  @Input('modalBodyWidth')
  set _bodyWidth(value: number) {
    this._width = value || 520;
  }

  //output
  @Output('onOkClick')
  onOkClick = new EventEmitter<MouseEvent>();

  @Output('onCancelClick')
  onCancelClick = new EventEmitter<MouseEvent>();

  lastPosition: Number_XY;           //上一次鼠标拖动停止的位置

  currentStartPos: Number_XY;        //当前窗体开始移动的起始位置

  currentPosition: Number_XY          //模态窗体的实时位置

  isMousedown: boolean;
  initPos: Number_XY;

  handleOk = (e) => {
    this.onOkClick.emit(e);
    this._isVisible = false;
  }

  handleCancel = (e) => {
    //reset position
    this.onCancelClick.emit(e);
    setTimeout(() => {
      this.currentPosition = new Number_XY(this.initPos.X, this.initPos.Y);

      this._style =
        {
          left: this.currentPosition.X + 'px',
          top: this.currentPosition.Y + 'px'
        }
    }, 400);
    this._isVisible = false;
  }

  constructor() {
    this.initPos = new Number_XY(0, 110);
    this.lastPosition = new Number_XY(this.initPos.X, this.initPos.Y);
    this.currentPosition = new Number_XY(this.initPos.X, this.initPos.Y);
    //解构赋值（只要对应上就可以赋值，少写了许多等号）
    [
      this._cancelText,
      this._isVisible,
      this._okText,
      this._style,
      this._title
    ] = [
        'Cancel',
        true,
        'OK',
        {
          left: this.initPos.X + 'px',
          top: this.initPos.Y + 'px'
        }
        ,
        'No Title'
      ]
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    //对鼠标移动事件进行处理
    window.onmousemove = (ev: MouseEvent) => {
      if (this.isMousedown) {
        //起始点到当前鼠标的位置的距离 = 当前鼠标的位置 - 鼠标按下时的位置 + 窗体在鼠标按下时所在的位置
        this.currentPosition.setXY(ev.x - this.currentStartPos.X + this.lastPosition.X,
          ev.y - this.currentStartPos.Y + this.lastPosition.Y);
        this._style =
          {
            left: this.currentPosition.X + 'px',
            top: this.currentPosition.Y + 'px'
          }
      }
    }

  }

  modalHeaderMouseup(ev: MouseEvent) {
    this.lastPosition.setXY(this.currentPosition.X, this.currentPosition.Y);
    this.isMousedown = false;
  }
  modalHeaderMousedown(ev: MouseEvent) {
    this.currentStartPos = new Number_XY(ev.x, ev.y);
    this.isMousedown = true;
  }

}
