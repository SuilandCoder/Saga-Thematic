import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/_common/services/user.service';
import { get } from 'lodash';
import { createHostListener } from '@angular/compiler/src/core';
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
    private service: UserService
  ) { }

  ngOnInit() {
    this.signUpFG = this.fb.group({
      userId: [get(this.service, 'jwt.user.userId'), [Validators.required, Validators.minLength(3)]],
      email: [get(this.service, 'jwt.user.email'), [Validators.required, Validators.email]],
      password: this.fb.group(
        {
          value: ['', [Validators.required, Validators.minLength(6)]],
          repeat: ['', [Validators.required, Validators.minLength(6)]],
          // repeat: new FormControl("", [Validators.required, Validators.minLength(6), this.validatePwdRepeat]),

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
    console.log("signUpData:", signUpData);
    this.service.signUp(signUpData).subscribe({
      next: res => {
        if (res.error) {
          this.errorInfo = {
            show: true,
            message: res.error
          };
        }
      },
      error: e => {
        console.log(e);
      }
    })
  }

  validatePwdRepeat(c: FormControl) {
    return c.value.value === c.value.repeat ? {
      repeat: {
        valid: true 
      }
    } : {
        repeat: {
          valid: false,
          errorMsg: "Passwords do not match."
        }
      }
  }

  equalValidator(ctrl) {
    // console.log('this in customer-validator: ', this)
    console.log("value:", ctrl.value.value);
    console.log("repeat:", ctrl.value.repeat);
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
