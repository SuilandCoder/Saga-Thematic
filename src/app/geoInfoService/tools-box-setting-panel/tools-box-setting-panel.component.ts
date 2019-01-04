import { Component, OnInit } from '@angular/core';
import {
  ToolsTreeNode,
  ToosTreeService,
  DataTransmissionService
} from '../../_common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tools-box-setting-panel',
  templateUrl: './tools-box-setting-panel.component.html',
  styleUrls: ['./tools-box-setting-panel.component.css']
})
export class ToolsBoxSettingPanelComponent implements OnInit {
  private TreeNode: ToolsTreeNode;
  public HandleOptions = {
    Add: 0,
    Delete: 1,
    Edit: 2
  }
  public CurrentHandle: number = this.HandleOptions.Edit;

  constructor(private toastr: ToastrService,
    private dataTransmissionService: DataTransmissionService,
    private toosTreeService: ToosTreeService) { }

  ngOnInit() {
    this.TreeNode = new ToolsTreeNode();
    this.dataTransmissionService.getSelectedToolNodeSubject().subscribe(treeNode => {
      this.TreeNode = treeNode;
    })
  }
  chooseHandleType(handleOption: number) {
    this.CurrentHandle = handleOption;
  }

  onAddClicked(name: string, modelId: string) {

    this.toosTreeService.addTool(new ToolsTreeNode(null, modelId, name, this.TreeNode.id)).then(res => {
      this.dataTransmissionService.sendToolsTreeUpdatedSubject();
      console.log(res);

    })

  }
  onSaveClicked(name: string, modelId: string) {

    this.toosTreeService.updateTool(new ToolsTreeNode(this.TreeNode.id, modelId, name, this.TreeNode.parentId)).then(res => {
      this.dataTransmissionService.sendToolsTreeUpdatedSubject();
      console.log(res);
    })

  }
  onDeleteClicked() {

    if (this.TreeNode.value === null) return;

    let DeleteOrNot = confirm('Sure to delete ' + this.TreeNode.value + ' ?');

    if (DeleteOrNot) {
      if (this.TreeNode.id !== 'NULL') {
        this.toosTreeService.deleteTool(this.TreeNode.id).then(res => {
          this.dataTransmissionService.sendToolsTreeUpdatedSubject();
          //console.log(res);
        })
      } else {
        this.toastr.warning("this node can not be delete.", "WARNING", { timeOut: 2000 });
      }
    }


  }

}
