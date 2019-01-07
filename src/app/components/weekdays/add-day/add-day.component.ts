import { WeekDay } from "./../weekday.model";
import { DataService } from "../../../services/data.service";
import { Component, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-add-day",

  template: `
  <h4>Selecione os dias da semana de reunião</h4>
    <mat-form-field>
      <mat-select #daySelected placeholder="Dias da semana">
        <mat-option *ngFor="let day of days" [value]="day">
          {{ day }}
        </mat-option>
      </mat-select>
    </mat-form-field>
    <button mat-mini-fab (click)="addDay(daySelected)">+</button>

 
    <app-list-day></app-list-day>

  `
})
export class AddDayComponent implements OnInit {
  days = [
    "",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo"
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  addDay(event: any) {
    if (event.value) this.dataService.addDay(event.value);
    event.value = "";
  }
}
