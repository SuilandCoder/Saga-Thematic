import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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
  ) { }

  ngOnInit() {

    this.signInFG = this.fb.group({
      username: ['',[Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberAccount: []
  });
  }

}
