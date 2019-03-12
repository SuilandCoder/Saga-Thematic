import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_common/services/user.service';
import { get } from 'lodash';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInFG: FormGroup;
  hide = true;
  isPending = false;
  errorInfo: {
      show: boolean,
      message?: string
  } = {
      show: false
  };
  constructor(
    private fb: FormBuilder,
    private service: UserService
  ) { }

  ngOnInit() {
    this.service.signOut();
        this.signInFG = this.fb.group({
            userId: [get(this.service, 'jwt.user.userId'), [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberAccount: [get(this.service, 'jwt.user.rememberAccount')]
        });
  }

  onSubmit(){
    this.isPending = true;
    this.errorInfo = {show:false};
    this.service.signIn(this.signInFG.value)
      .subscribe({
        next: res=>{
          this.isPending = false;
          if(res.error){
            this.errorInfo ={
               show:true,
               message:res.error
            };
          }
        },
        error: e=>{
          console.log(e);
        }
      })


  }

}
