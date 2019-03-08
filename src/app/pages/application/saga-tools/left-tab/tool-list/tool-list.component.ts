import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TreeModel, Ng2TreeSettings, NodeEvent } from 'ng2-tree';
import { ToolsTreeService } from 'src/app/_common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolService } from 'src/app/_common/services/tool.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tool-list',
  templateUrl: './tool-list.component.html',
  styleUrls: ['./tool-list.component.css']
})
export class ToolListComponent implements OnInit {

  public CurrentIndex = 1;
  CurrentSelected: any;
  public ButtonText = 'Next';
  public tree: TreeModel;
  private treeJSONPath = "assets/json/tools_tree.json"
  @ViewChild('ToolsTree')
  public ToolsTree: any;
  public settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  constructor(
    private toolsTreeService: ToolsTreeService,
    public dialog: MatDialog,
    public toolService:ToolService
  ) { }

  ngOnInit() {
    this.initTree();
    this.CurrentSelected = null;
    this.tree.loadChildren = (callback => {
      this.toolsTreeService.getToolsTree_leftTab(this.treeJSONPath).then(childrenArray => {
        callback(childrenArray);
      })
    })
  }

  private initTree() {
    this.tree = {
      value: "Saga Tools",
      id: 'NULL',
      settings: {
        isCollapsedOnInit: true
      },
      children: [],
    }
  }

  onNodeSelected(e: NodeEvent): void {
    if (e.node.isLeaf()) {
      this.CurrentSelected = e.node;
      console.log(e.node.parent.id + "   " + e.node.id);
      var path = e.node.parent.id;
      var id = e.node.id;
      this.toolService.sendModelInfoMessage(path,id);
    } else {
      this.CurrentSelected = undefined;
      const thisControl = this.ToolsTree.getControllerByNodeId(e.node.id);
      e.node.isNodeCollapsed() ? thisControl.expand() : thisControl.collapse();
      //? this.modelService.clearMessage?  移除右侧的模型信息?
    }
  }

}