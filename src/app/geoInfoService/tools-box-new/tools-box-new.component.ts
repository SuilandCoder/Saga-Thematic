import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools-box-new',
  templateUrl: './tools-box-new.component.html',
  styleUrls: ['./tools-box-new.component.css']
})
export class ToolsBoxNewComponent implements OnInit {
  private title: string;
  private tagIndex: number = 1;
  private selectedNode: any;

  constructor() { }

  ngOnInit() {

    this.title = this.tagIndex === 1 ? 'Choose Tool' : this.selectedNode ? this.selectedNode.node.value.toString() : 'No Tool Selected';

  }



}
