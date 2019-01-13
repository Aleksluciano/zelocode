import { DayPrivileges } from './dayprivileges.model';
import { Privilege } from '../privileges/privilege.model';
import { WeekDay } from '../weekdays/weekday.model';
import { DataService } from '../../services/data.service';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-dayprivileges',
  template: `
  <h4>Indique os privilégios de cada dia</h4>


  <div  *ngFor="let day of dataSource; let i = index">

  <strong>{{ day.nameDay }}</strong>
  <div  *ngFor="let priv of day.privileges">
  <mat-checkbox [checked]="findIfChecked(day.nameDay, priv.name, priv.rank)" (change)="onSaveCheck(day.nameDay, priv.rank,priv.name, $event)">{{ priv.name }}</mat-checkbox> </div>
  </div>

  `

})
export class DayprivilegesComponent implements OnInit {
  listPrivileges: Privilege[] = [];
  subPrivilege: any;
  pronto = false;



  listDays: WeekDay[] = [];
  subDays: any;

  dayprivileges: DayPrivileges[] = [];

  dataSource = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {

 this.dataService.getAllDaysExec()
    .then(result => {
      this.listDays = result as WeekDay[];

      this.dataService.getAllPrivilegesExec().then(result => {
        this.listPrivileges = result as Privilege[]

        this.dataService.getAllDayPrivilegesExec().then(result => {
         this.dayprivileges = result as DayPrivileges[];

          this.listDays.forEach(r=>{




            let data ={
              nameDay: r.name,
              privileges: [...this.listPrivileges]
            }



            this.dataSource.push(data)


        })



this.pronto = true;


      })



     })




      });










  }


  onSaveCheck(nameday, rank, nameprivilege, e){
     this.dataService.addDayPrivilege(nameday,rank,nameprivilege,e.checked)
}

findIfChecked(dayname, privname, rank){
  let priv = this.dayprivileges.find(k=> k.nameday == dayname && k.rank == rank)
  if(priv)
  return priv.checked
  else return false

}


}
