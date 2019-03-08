import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpFG: FormGroup;
  hide = true;
  hideRepeat = true;
  errorInfo: {
    show: boolean,
    message?: string
  } = {
      show: false
    };
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.signUpFG = this.fb.group({
      username: [],
      email: [ ],
      password: this.fb.group(
          {
              value: ['', [Validators.required, Validators.minLength(6)]],
              repeat: ['', [Validators.required, Validators.minLength(6)]]
          },
          {
              validator: this.equalValidator
          }
      )
  });
  }

  onSubmit() {
    this.errorInfo = { show: false };
    var signUpData = this.signUpFG.value;
    signUpData.password = this.signUpFG.get('password').get('value').value;
    console.log("signUpData:",signUpData);
    // this.service.signUp(signUpData).subscribe({
    //   next: res => {
    //     if (res.error) {
    //       this.errorInfo = {
    //         show: true,
    //         message: res.error.desc
    //       };
    //     }
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // })
  }

  equalValidator(ctrl) {
    // console.log('this in customer-validator: ', this)
    if (ctrl.value.value === ctrl.value.repeat) {
      return null;
    }
    else {
      return {
        passwordEqual: true
      };
    }
  }
}
