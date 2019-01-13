import { UserExceptions } from "./userexceptions.model";
import {  DateAdapter
} from "@angular/material";
import { User } from "../users/user.model";
import { DataService } from "../../services/data.service";
import { Component, OnInit } from "@angular/core";
import { Exception } from "../exceptions/exception.model";
import { DateFormat } from "../date.format";

@Component({
  selector: "app-userusers",
  styles:[`
    .inline{
      display: inline-block
    }

    `],
  providers: [{ provide: DateAdapter, useClass: DateFormat }],
  template: `
    <h4>Indique as exceções de cada varão</h4>
    <div *ngFor="let user of dataSource; let i = index">
      <strong>{{ user.nameUser }}</strong>
      <table>
        <tr *ngFor="let excep of user.exceptions; let t = index" >
          <td>
            <mat-checkbox
              [(ngModel)]="excep.checked"
              (change)="onSaveCheck(user.nameUser, excep.name, excep.checked, excep.date)"
              >{{ excep.name }}</mat-checkbox
            >
          </td>
          <td *ngIf="excep.checked" class="inline">

            <input matInput [matDatepicker]="it" [(ngModel)]="excep.date"
            placeholder="Data da última participação">
            <mat-datepicker-toggle  [for]="it" ></mat-datepicker-toggle>
            <mat-datepicker #it ></mat-datepicker>

             <button mat-raised-button (click)="onSaveCheck(user.nameUser, excep.name, excep.checked, excep.date)">Salvar data</button>

          </td>
        </tr>
      </table>
    </div>
  `
})
export class UserexceptionsComponent implements OnInit {
  listExceptions: Exception[] = [];
  subException: any;

  subUser: any;
  pronto = false;

  listUsers: User[] = [];
  subUsers: any;

  userExceptions: UserExceptions[] = [];

  dataSource = [];

  constructor(
    private dataService: DataService,
    private dateAdapter: DateAdapter<Date>
  ) {
    dateAdapter.setLocale("en-in");
  }

  ngOnInit() {
    this.dataService.getAllUsersExec().then(result => {
      this.listUsers = result as User[];

      this.dataService.getAllExceptionsExec().then(result => {
        this.listExceptions = result as Exception[];

        this.dataService.getAllUserExceptionsExec().then(result => {
          this.userExceptions = result as UserExceptions[];

          this.listUsers.forEach(r => {
            let mapP = this.listExceptions.map(a => {
              let valueChecked = false;
              let inidate = null;
              let excep = this.userExceptions.find(
                k => k.nameuser == r.name && k.nameexception == a.name
              );
              if (excep){ valueChecked = excep.checked;
                if(excep.date)
                inidate = new Date(excep.date);
              }
              console.log(excep)
              return { name: a.name, checked: valueChecked, date: inidate};
            });

            let data = {
              nameUser: r.name,
              exceptions: [...mapP]
            };

            this.dataSource.push(data);
          });

          this.pronto = true;
        });
      });
    });
  }



  onSaveCheck(nameuser, nameexception, checked, date) {
    this.dataService
      .addUserException(nameuser, nameexception, checked, date)

  }


}
