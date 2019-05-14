import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolService, DataTransmissionService, UtilService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from '../../services/user-data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tool-dialog',
  templateUrl: './tool-dialog.component.html',
  styleUrls: ['./tool-dialog.component.scss']
})
export class ToolDialogComponent implements OnInit {

  visibleCss:string;
  @Input()
  set displayInfo(show:any){
    this.visibleCss= show?"block":"none";
  }

  get displayInfo(){
    return this.visibleCss;
  }


  subscription: Subscription;  
  toolDesHeight: number;
  private descriptionHtml = "";
  private descriptionPath = "";
  private path: string = "json/modelInfo/climate_tools.json";
  private id = "9";
  toolInfo;
  dialogHeight;
  tool_des_height;
  constructor(
    private toolService: ToolService,
    public toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private dataTransmissionService: DataTransmissionService,
    private toast: ToastrService,
    private userDataService: UserDataService,
    private userService: UserService,
    private utilService: UtilService,
  ) { }

  ngOnInit() {

    this.dialogHeight = window.innerHeight*0.8;
    window.addEventListener('resize', () => {
      this.dialogHeight = window.innerHeight*0.8;
    })

    this.tool_des_height = window.innerHeight*0.8-150;
    window.addEventListener('resize', () => {
      this.tool_des_height = window.innerHeight*0.8-150;
    })

    this.subscription = this.toolService.getModelInfoMessage().subscribe(({ path, id }) => {
      this.path = path;
      this.id = id;
      this.getDescpPathByJsonPath(path, id);
      console.log("path:" + path + "  id:" + id);
      this.toolService.getToolById(this.path, this.id).then(data => {
        console.log("toolInfo:",data);
        this.toolInfo = data;
        this.dataTransmissionService.sendToolDialogControlSubject(true);
      }).catch(err => {
        console.log(err);
        this.toastr.error(err);
      });
    })
  }


  getDescpPathByJsonPath(path, id) {
    if (path) {
      var libraryName = path.substring(path.lastIndexOf("/") + 1, path.indexOf(".json"));
      this.descriptionPath = "assets/html/" + libraryName + "/" + libraryName + "_" + id + ".html";
      $.get(this.descriptionPath, data => {
        // console.log(data); 
        this.descriptionHtml = data;
      })
    }
  }

  onTabChanged(nzTabChangeEvent) { }

  openMyDialog(){
    this.dataTransmissionService.sendToolDialogControlSubject();
  }

}
