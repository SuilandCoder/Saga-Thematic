import { Injectable } from '@angular/core'
import { Observable, Subject } from "rxjs";
import {Number_XY, MouseEventValue} from '../data_model'

/**
 *  用以处理使用bootstrap 写的模态框的拖动事件，后面用NZ-ZORRO 的就不需要这个了
 */
@Injectable()
export class WindowEventService{

    //在dialog-head区域鼠标按下与否事件
    private DialogMousePressedSubject = new Subject<MouseEventValue>();
    //在dialog-head区域鼠标按下之后，鼠标移动事件
    private DialogMouseMovedSubject = new Subject<Number_XY>();


    constructor(){}
    /////////   send    ////////////////


    sendDialogMousePressedSubject(mouseEventValue:MouseEventValue){
        this.DialogMousePressedSubject.next(mouseEventValue);
    }

    sendDialogMouseMovedSubject(xyInstance:Number_XY){
        this.DialogMouseMovedSubject.next(xyInstance);
    }


    ////////    get     /////////////////////////
    getDialogMousePressedSubject():Observable<MouseEventValue>{
        return this.DialogMousePressedSubject.asObservable();
    }
    getDialogMouseMovedSubject():Observable<Number_XY>{
        return this.DialogMouseMovedSubject.asObservable();
    }
}