import { Directive, ElementRef, Input, HostListener, OnInit } from '@angular/core';
import { DataTransmissionService } from '../services/data-transmission.service'
import { WindowEventService } from '../services/window.event.service'
import { Number_XY, MouseEventValue } from '../data_model'


//window risize
@Directive({ selector: 'body' })
export class MapResizeDirective {
  constructor(private dataTransmissionService: DataTransmissionService) {

  }

  //resize
  @HostListener('window:resize', ['$event.target'])
  onResize(ev: Window) {
    this.dataTransmissionService.sendMapResizeSubject(ev);
  }
}

//dialog drag
@Directive({ selector: '.modal-header' })
export class DialogDragDirective {
  private MousePressed: boolean = false;

  constructor(private windowEventService: WindowEventService) { }

  //onMousePress
  @HostListener('mousedown', ['$event'])
  onmousedown(ev: MouseEvent) {
    this.windowEventService.sendDialogMousePressedSubject(new MouseEventValue("MOUSEDOWN",new Number_XY(ev.x,ev.y)));
  }
  @HostListener('mouseup', ['$event'])
  onmouseup(ev: MouseEvent) {
    this.windowEventService.sendDialogMousePressedSubject(new MouseEventValue("MOUSEUP",new Number_XY(ev.x,ev.y)));
  }
}

//modal mouse move
@Directive({ selector: '.modal' })
export class WindowMouseMoveDirective {
  
  private MousePressed: boolean = false;
  private OriginalPoint: Number_XY;

  constructor(private windowEventService: WindowEventService) {
    this.windowEventService.getDialogMousePressedSubject().subscribe(mouseEventValue => {
      if(mouseEventValue.type==="MOUSEDOWN"){
        this.OriginalPoint =mouseEventValue.pos;
        this.MousePressed = true;
      }else if(mouseEventValue.type==="MOUSEUP"){
        this.MousePressed = false;
      }
    })
  }
  //onMouseMove
  @HostListener('mousemove', ['$event'])
  onMousemove(ev: MouseEvent) {
    if (this.MousePressed) {
      this.windowEventService.sendDialogMouseMovedSubject(new Number_XY(ev.x - this.OriginalPoint.X, ev.y - this.OriginalPoint.Y));
    }
  }
}
