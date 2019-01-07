import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatSelectModule, MatListModule, MatIconModule, MatInputModule, MatTableModule, MatCheckbox, MatCheckboxModule, MatTabsModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule, MAT_DATE_FORMATS, MatBadgeModule } from '@angular/material'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddDayComponent } from './components/weekdays/add-day/add-day.component';
import { ListDayComponent } from './components/weekdays/list-day/list-day.component';
import { ListUserComponent } from './components/users/list-user/list-user.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { AddPrivilegeComponent } from './components/privileges/add-privilege/add-privilege.component';
import { ListPrivilegeComponent } from './components/privileges/list-privilege/list-privilege.component';
import { DayprivilegesComponent } from './components/dayprivileges/dayprivileges/dayprivileges.component';
import { UserprivilegesComponent } from './components/userprivileges/userprivileges/userprivileges.component';
import { FormsModule } from '@angular/forms';
import { GenerationsComponent } from './components/generations/generations.component';


@NgModule({
  declarations: [
    AppComponent,
    AddDayComponent,
    ListDayComponent,
    ListUserComponent,
    AddUserComponent,
    AddPrivilegeComponent,
    ListPrivilegeComponent,
    DayprivilegesComponent,
    UserprivilegesComponent,
    GenerationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
