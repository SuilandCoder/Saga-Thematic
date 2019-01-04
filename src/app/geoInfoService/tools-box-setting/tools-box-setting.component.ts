import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeModel, Ng2TreeSettings, Tree } from 'ng2-tree';

import {
  Number_XY,
  ToosTreeService,
  WindowEventService,
  DataTransmissionService
} from '../../_common';

@Component({
  selector: 'app-tools-box-setting',
  templateUrl: './tools-box-setting.component.html',
  styleUrls: ['./tools-box-setting.component.css'],
  providers: [ToosTreeService]
})
export class ToolsBoxSettingComponent implements OnInit {

  public SettingTree: TreeModel;

  private CurrentSelected: Tree;

  public contextMenuX: string = '200px';
  public contextMenuY: string = '200px';
  public contextMenuShowed: boolean = false;
  public SettingShow: boolean;
  private MousePressed = false;
  private Number_XY: Number_XY;
  MoveDistance: Number_XY;
  private DialogMousePressedSubscription: Subscription;
  private DialogMouseMovedSubscription: Subscription;
  @ViewChild('ToolsTree')
  public ToolsTree: any;

  @ViewChild('ToolsBoxSettingModal')
  public SettingModal: ElementRef;

  public settings: Ng2TreeSettings = {
    rootIsVisible: true

  };


  constructor(private toosTreeService: ToosTreeService,
    private dataTransmissionService: DataTransmissionService,
    private windowEventService: WindowEventService) { }

  private initTree() {
    this.SettingTree = {
      value: "Geographical Tools",
      id: 'NULL',
      settings: {
        cssClasses: {
          expanded: 'fa fa-caret-down',
          collapsed: 'fa fa-caret-right',
          empty: 'fa fa-caret-right disabled',
          leaf: 'fa fa-lg'
        },
        templates: {
          node: '<i class="fa fa-archive tree-node"></i>',
          leaf: '<i class="fa fa-wrench tree-leaf"></i>'
        },
        static: true
      }
    }
    this.SettingTree.loadChildren = (callback => {

      this.toosTreeService.getToolsTree().then(childrenArray => {
        callback(childrenArray);
      })
    })
  }
  onClick() {

    //当鼠标按下时
    this.DialogMousePressedSubscription = this.windowEventService.getDialogMousePressedSubject().subscribe(pressed => {
      if (pressed) {
        this.Number_XY = new Number_XY(0, 0);
      }
    })
    //当鼠标按下并移动时
    this.DialogMouseMovedSubscription = this.windowEventService.getDialogMouseMovedSubject().subscribe(Number_XY => {
      this.MoveDistance.setXY(Number_XY.X - this.Number_XY.X + this.MoveDistance.X,
        Number_XY.Y - this.Number_XY.Y + this.MoveDistance.Y);
      this.Number_XY = Number_XY;

    })
  }
  ngOnInit() {
    this.initTree();

    this.MoveDistance = new Number_XY(0, 0);
    this.Number_XY = new Number_XY(0, 0);
    this.dataTransmissionService.getToolsTreeUpdatedSubject().subscribe(next => {
      const thisControl = this.ToolsTree.getControllerByNodeId(this.SettingTree.id);
      thisControl.reloadChildren();

    })

    this.dataTransmissionService.getSettingTreeContextMenuSubject().subscribe(ev => {
      this.contextMenuX = ev.clientX + 'px';
      this.contextMenuY = ev.clientY + 'px';
      this.contextMenuShowed = true;
    })

    //添加监听事件
    document.getElementById('ToolsBoxSettingModal').addEventListener('click', ev => {
      //判断模态框是否关闭,若关闭，则取消订阅
      let ClickedElem = ev.toElement;
      if (ClickedElem.hasAttribute('data-dismiss')) {
        if (this.DialogMousePressedSubscription) {
          this.DialogMousePressedSubscription.unsubscribe();
        }
        if (this.DialogMouseMovedSubscription) {
          this.DialogMouseMovedSubscription.unsubscribe();
        }
        setTimeout(() => this.MoveDistance.setXY(0, 0), 1000);
      }
    })

  }

  public onNodeSelected(e): void {
    if (e.node.isLeaf()) {
      this.CurrentSelected = e.node;
    } else {
      this.CurrentSelected = null;
      const thisControl = this.ToolsTree.getControllerByNodeId(e.node.id);

      if (thisControl) {
        thisControl.isCollapsed() ? thisControl.expand() : thisControl.collapse();
      }

    }
    this.dataTransmissionService.sendSelectedToolNodeSubject(e.node.node);
  }

  //按键事件

  @HostListener('document:click', ['$event'])
  onLeftClick(ev: Event) {
    this.contextMenuShowed = false;

  }




}
