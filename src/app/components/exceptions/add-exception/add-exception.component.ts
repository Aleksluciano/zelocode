import { DataService } from "../../../services/data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-exception",

  template: `
    <h4>Adicione as exceções</h4>

    <mat-form-field>
      <input #exception matInput placeholder="Nome" />
    </mat-form-field>
    <button mat-mini-fab (click)="addException(exception)">+</button>

<app-list-exception></app-list-exception>

  `
})
export class AddExceptionComponent implements OnInit {

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  addException(exception: any) {
    if (exception.value) this.dataService.addException(exception.value);
    exception.value = "";
  }
}
