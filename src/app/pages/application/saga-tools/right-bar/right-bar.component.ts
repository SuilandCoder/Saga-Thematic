import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core'; 
import { ToolService, DataTransmissionService } from 'src/app/_common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_common/services/user.service';
import { UsersModule } from 'src/app/pages/users/users.module';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit {
  subscription: Subscription;
  tab:string = "";
  toolChoosed:boolean = false;

  @Output()
  rightTabToggle:EventEmitter<any> = new EventEmitter();

  constructor(
    private toolService:ToolService,
    private toast: ToastrService,
    private userService:UserService,
    private dataTransmissionService: DataTransmissionService,
  ) {}

  ngOnInit() {
    this.subscription = this.toolService.getModelInfoMessage().subscribe(_=>{
      this.tab = "des";
      this.toolChoosed = true;
    })
  }

  des_toggle(){
    if(!this.toolChoosed){
      this.toast.warning("please choose a tool from the left tools tree.", "Warning", { timeOut: 3000 });
      return;
    }
    this.dataTransmissionService.sendToolDialogControlSubject();
    // this.tab = "des";
    // this.rightTabToggle.emit(this.tab);
  }

  data_toggle(){
    //! 判断是否登陆
    if(!this.userService.isLogined){
      this.toast.warning("please login.", "Warning", { timeOut: 3000 });
      return;
    }
    this.tab = "data";
    this.rightTabToggle.emit(this.tab);
  }
}
