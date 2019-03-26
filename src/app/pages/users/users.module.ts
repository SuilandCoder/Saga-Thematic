import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { UserSettingComponent } from './user-setting/user-setting.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule
} from '@angular/material';
import { TopBarComponent } from './top-bar/top-bar.component';
import { Routes, RouterModule } from '@angular/router';




@Component({
  selector: "app-user",
  template: `
    <user-top-bar></user-top-bar>
    <router-outlet></router-outlet>
  `
})
export class UserComponent { }

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent
      }, {
        path: 'sign-up',
        component: SignUpComponent
      }, {
        path: ':userName',
        component: ProfileComponent,
        children: [
          {
            path: 'settings',
            component: UserSettingComponent
          }
        ]
      }, {
        path: '**',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      }
    ]
  },
];

const modules = [
  CommonModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatChipsModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule,
  RouterModule.forChild(routes),
]

@NgModule({
  imports: [...modules],
  declarations: [UserComponent, SignInComponent, SignUpComponent, ProfileComponent, UserSettingComponent, TopBarComponent]
})
export class UsersModule { }
