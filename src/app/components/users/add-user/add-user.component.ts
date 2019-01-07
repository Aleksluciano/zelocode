import { DataService } from "../../../services/data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-user",

  template: `
    <h4>Adicione os varões</h4>

    <mat-form-field>
      <input #user matInput placeholder="Nome" />
    </mat-form-field>
    <button mat-mini-fab (click)="addUser(user)">+</button>

<app-list-user></app-list-user>

  `
})
export class AddUserComponent implements OnInit {

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  addUser(user: any) {
    if (user.value) this.dataService.addUser(user.value);
    user.value = "";
  }
}
