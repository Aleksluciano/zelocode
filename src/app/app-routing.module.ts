import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDayComponent } from './components/weekdays/add-day/add-day.component';
import { AddPrivilegeComponent } from './components/privileges/add-privilege/add-privilege.component';
import { DayprivilegesComponent } from './components/dayprivileges/dayprivileges/dayprivileges.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { UserprivilegesComponent } from './components/userprivileges/userprivileges/userprivileges.component';
import { GenerationsComponent } from './components/generations/generations.component';

const routes: Routes = [
{path: '', component: AddDayComponent},
{path: 'privileges', component: AddPrivilegeComponent},
{path: 'dayprivileges', component: DayprivilegesComponent},
{path: 'users', component: AddUserComponent},
{path: 'userprivileges', component: UserprivilegesComponent},
{path: 'generations', component: GenerationsComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

