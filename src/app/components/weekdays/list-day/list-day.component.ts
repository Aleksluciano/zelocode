import { WeekDay } from './../weekday.model';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-list-day",
  styles:[`
  #btDelete{
    width: 25px;
    height: 25px;
  }
  `],
  template: `

      <div *ngFor="let listDay of listDays">
        <button  mat-icon-button  (click)="deleteDay(listDay)"><mat-icon>delete</mat-icon></button
        > {{ listDay.name }}
     </div>


     <div style="margin-top: 20%">
     <button (click)="apagar()">Apagar Sistema</button>
     <div *ngIf="certeza">
     <span >Isso apagará todos os dados de todas as tabelas
     do sistema. Confirme se tem certeza que quer isso.</span>
     <button (click)="confirmar()">Confirmar</button>
     </div>
     </div>

  `
})
export class ListDayComponent implements OnInit {
  listDays: WeekDay[];
  sub: any;
  certeza = false;
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.sub = this.dataService.getAllDays().subscribe(result => {
      this.listDays = result as WeekDay[];
      this.cd.detectChanges();
    });
  }

  deleteDay(value) {
    this.dataService.deleteDay(value.name);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  confirmar(){
    this.dataService.deleteAll();
    this.certeza = false;
  }
  apagar(){
    this.certeza = true
    setTimeout(()=>{
      this.certeza = false;
    }, 10000)
  }
}
