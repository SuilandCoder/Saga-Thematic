import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { TreeModel, Ng2TreeSettings, NodeEvent } from 'ng2-tree';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  Number_XY,
  ToosTreeService,
  WindowEventService,
  DataTransmissionService
} from '../../_common';

@Component({
  selector: 'app-tools-box',
  templateUrl: './tools-box.component.html',
  styleUrls: ['./tools-box.component.css'],
  providers: [ToosTreeService]
})
export class ToolsBoxComponent implements OnInit, AfterViewInit {


  public ModelTitle = 'Choose Tool';
  public CurrentIndex = 1;
  public ButtonText = 'Next';
  public tree: TreeModel;
  CurrentSelected: any;
  CurrentTitle: string;
  private SelectedId: any;
  private hide = "none";
  private show = "block";
  private Prepared = false;
  private MousePressed = false;
  private Number_XY: Number_XY;
  currentMoveDistance: Number_XY;
  private DialogMousePressedSubscription: Subscription;
  private DialogMouseMovedSubscription: Subscription;
  @ViewChild('ToolsTree')
  public ToolsTree: any;

  public settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  constructor(private toosTreeService: ToosTreeService,
    private dataTransmissionService: DataTransmissionService,
    private windowEventService: WindowEventService,
    public toastr: ToastrService,
    vcr: ViewContainerRef
  ) {
    // this.toastr.setRootViewContainerRef(vcr);

  }

  private initTree() {
    this.tree = {
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
        }
      }
    }
    this.tree.loadChildren = (callback => {

      this.toosTreeService.getToolsTree().then(childrenArray => {
        callback(childrenArray);
      })
    })
  }

  ngOnInit() {
    this.initTree();
    this.currentMoveDistance = new Number_XY(0, 110);
    this.Number_XY = new Number_XY(0, 0);
    this.dataTransmissionService.getToolsTreeUpdatedSubject().subscribe(next => {
      const thisControl = this.ToolsTree.getControllerByNodeId(this.tree.id);
      if (thisControl) {
        thisControl.reloadChildren();
        this.CurrentSelected = null;
        this.CurrentTitle = null;
      }
    })

    //工具输入是否准备完毕
    this.dataTransmissionService.getPreparedStateSubject().subscribe(next => {
      this.Prepared = next;
    })

    //添加监听事件
    document.getElementById('ToolsBoxModal').addEventListener('click', ev => {
      //判断模态框是否关闭,若关闭，则取消订阅
      let ClickedElem = ev.toElement;
      if (ClickedElem.hasAttribute('data-dismiss')) {
        if (this.DialogMousePressedSubscription) {
          this.DialogMousePressedSubscription.unsubscribe();
        }
        if (this.DialogMouseMovedSubscription) {
          this.DialogMouseMovedSubscription.unsubscribe();
        }
        setTimeout(() => {
          this.currentMoveDistance = new Number_XY(0, 110);
          this.Number_XY = new Number_XY(0, 0);
        }, 500);
      }
    })

  }

  onShowToolBox() {
    ////订阅模态框拖拽相关事件

    //当鼠标按下时
    this.DialogMousePressedSubscription = this.windowEventService.getDialogMousePressedSubject().subscribe(pressed => {
      if (pressed) {
        this.Number_XY = new Number_XY(0, 0);
      }
    })

    //当鼠标按下并移动时
    this.DialogMouseMovedSubscription = this.windowEventService.getDialogMouseMovedSubject().subscribe(Number_XY => {
      this.currentMoveDistance.setXY(Number_XY.X - this.Number_XY.X + this.currentMoveDistance.X,
        Number_XY.Y - this.Number_XY.Y + this.currentMoveDistance.Y);
      this.Number_XY = Number_XY;

    })
  }

  ngAfterViewInit(): void {
  }

  public onNodeSelected(e: NodeEvent): void {
    if (e.node.isLeaf()) {
      this.CurrentSelected = e.node;
    } else {
      this.CurrentSelected = undefined;

      const thisControl = this.ToolsTree.getControllerByNodeId(e.node.id);
      if (thisControl) {
        e.node.isNodeCollapsed() ? thisControl.expand() : thisControl.collapse();
      }
    }
  }

  public onNextClick(): void {
    if (this.CurrentIndex === 1) {
      this.ButtonText = "Finish";
      if (this.CurrentSelected) {
        this.SelectedId = this.CurrentSelected.node.modelId;
        this.CurrentTitle = this.CurrentSelected.node.value.toString();
      } else {
        this.CurrentSelected = undefined;
      }
      this.CurrentIndex += 1;
    }
  }

  public onBackClicked(): void {
    if (this.CurrentIndex === 2) {
      this.ButtonText = "Next";
      this.ModelTitle = "Choose Tool";
      this.CurrentIndex -= 1;
    }
  }

  // public onReceiveSignal(signal: string) {
  //   console.log(signal);
  // }

  public handleActionOnTree(id: number | string, action: string) {
    const treeController = this.ToolsTree.getControllerByNodeId(id);
    if (treeController && typeof treeController[action] === 'function') {
      treeController[action]();
    } else {
      this.toastr.info('There isn`t a controller for a node with id - ' + id, 'INFO', { timeOut: 6000 });
    }
  }

  public finish() {
    this.dataTransmissionService.sendReadySubject();
    this.toastr.info('Waiting calculation...', 'INFO', { timeOut: 6000 });
  }
}
