import { ModelsInfoComponent } from './../../pages/models-info/models-info.component';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TreeModel, Ng2TreeSettings, NodeEvent } from 'ng2-tree';
import { ToosTreeService } from '../../_common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModelService } from 'src/app/@core/data/model.service';

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
  animal: string = "cat";
  name: string = "zrm";
  private treeJSONPath = "../../../assets/json/ng2tree.json"
  @ViewChild('ToolsTree')
  public ToolsTree: any;
  public settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  constructor(
    private toosTreeService: ToosTreeService,
    public dialog: MatDialog,
    public modelService:ModelService
  ) { }

  ngOnInit() {
    this.initTree();
    this.CurrentSelected = null;
    this.tree.loadChildren = (callback => {
      this.toosTreeService.getToolsTree_leftTab(this.treeJSONPath).then(childrenArray => {
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
      this.modelService.sendMessage(path,id);
    } else {
      this.CurrentSelected = undefined;
      const thisControl = this.ToolsTree.getControllerByNodeId(e.node.id);
      e.node.isNodeCollapsed() ? thisControl.expand() : thisControl.collapse();

      //? this.modelService.clearMessage?  移除右侧的模型信息?
      
    }
  }


  openToolDialog(): void {
    const dialogRef = this.dialog.open(ToolDialog, {
      width: '300px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    })
  }
}


@Component({
  selector: 'tool-dialog',
  templateUrl: 'tool-dialog.html',
})
export class ToolDialog {

  constructor(
    public dialogRef: MatDialogRef<ToolDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}