import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
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

const modules = [
  CommonModule,
  ReactiveFormsModule,
  UsersRoutingModule,
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
]

@NgModule({
  imports: [...modules],
  declarations: [SignInComponent, SignUpComponent, ProfileComponent, UserSettingComponent]
})
export class UsersModule { }
