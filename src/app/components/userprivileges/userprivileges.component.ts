import { UserPrivileges } from "./userprivileges.model";
import {  DateAdapter
} from "@angular/material";
import { User } from "../users/user.model";
import { DataService } from "../../services/data.service";
import { Component, OnInit } from "@angular/core";
import { Privilege } from "../privileges/privilege.model";
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
    <h4>Indique os privilégios de cada varão</h4>
    <p>( A data representa a última vez que o irmão participou naquele privilégio. Em um primeiro cadastro, apenas preencha a data de irmãos que participaram recentemente, fazendo com que na geração automática, estes irmãos sejam considerados por último )</p>
    <div *ngFor="let user of dataSource; let i = index">
      <strong>{{ user.nameUser }}</strong>
      <table>
        <tr *ngFor="let priv of user.privileges; let t = index" >
          <td>
            <mat-checkbox
              [(ngModel)]="priv.checked"
              (change)="onSaveCheck(user.nameUser, priv.name, priv.checked, priv.date, priv.rank)"
              >{{ priv.name }}</mat-checkbox
            >
          </td>
          <td *ngIf="priv.checked" class="inline">

            <input matInput [matDatepicker]="it" [(ngModel)]="priv.date"
            placeholder="Data da última participação">
            <mat-datepicker-toggle  [for]="it" ></mat-datepicker-toggle>
            <mat-datepicker #it ></mat-datepicker>

             <button mat-raised-button (click)="onSaveCheck(user.nameUser, priv.name, priv.checked, priv.date, priv.rank)">Salvar data</button>

          </td>
        </tr>
      </table>
    </div>
  `
})
export class UserprivilegesComponent implements OnInit {
  listPrivileges: Privilege[] = [];
  subPrivilege: any;

  subUser: any;
  pronto = false;

  listUsers: User[] = [];
  subUsers: any;

  userPrivileges: UserPrivileges[] = [];

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

      this.dataService.getAllPrivilegesExec().then(result => {
        this.listPrivileges = result as Privilege[];

        this.dataService.getAllUserPrivilegesExec().then(result => {
          this.userPrivileges = result as UserPrivileges[];

          this.listUsers.forEach(r => {
            let mapP = this.listPrivileges.map(a => {
              let valueChecked = false;
              let inidate = null;
              let priv = this.userPrivileges.find(
                k => k.nameuser == r.name && k.rank == a.rank
              );
              if (priv){ valueChecked = priv.checked;
                if(priv.date)
                inidate = new Date(priv.date);
              }
              console.log(priv)
              return { name: a.name, checked: valueChecked, date: inidate, rank: a.rank  };
            });

            let data = {
              nameUser: r.name,
              privileges: [...mapP]
            };

            this.dataSource.push(data);
          });

          this.pronto = true;
        });
      });
    });
  }



  onSaveCheck(nameuser, nameprivilege, checked, date, rank) {
    this.dataService
      .addUserPrivilege(nameuser, nameprivilege, checked, date, rank)

  }


}
