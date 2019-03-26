import { Ng2TreeSettings, TreeModel, NodeEvent } from 'ng2-tree';
import { MenuService } from '../_common/services/menu.service';
import { Component, Injectable, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { ToolsTreeService } from '../_common';
 
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

@Injectable()
export class FileDatabase { 
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor(private menuService: MenuService) {
    this.initialize();
  }

  initialize() {
    this.menuService.getTreeJson().then((dataObject) => {
      // Parse the string to json object.
      // const dataObject = JSON.parse(res);

      // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
      //     file node as children.
      // console.log(dataObject);
      const data = this.buildFileTree(dataObject, 0);

      // Notify the change.
      this.dataChange.next(data);
    });

  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      } 
      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [FileDatabase]
})
export class PagesComponent {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(
    private menuService: MenuService,
    private toolsTreeService: ToolsTreeService,
    database: FileDatabase
  ) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }


  ngOnInit(): void {
    $("#dataContainer li").hide();
  }


  showDataList() {
    if ($("#dataContainer li").is(":visible")) {
      $("#dataContainer li").hide();
    } else {
      $("#dataContainer li").show();
    }
  }

  showModuleTree() {
    if ($("#module_tree").is(":visible")) {
      $("#module_tree").hide();
    } else {
      $("#module_tree").show();
    }
  }


  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;
}
