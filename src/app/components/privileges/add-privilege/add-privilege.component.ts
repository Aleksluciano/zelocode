import { DataService } from "../../../services/data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-privilege",

  template: `
    <h4>Indique os privilégios existentes</h4>
    <mat-form-field>
      <mat-select #rankSelected placeholder="Rank">
        <mat-option *ngFor="let rank of ranks" [value]="rank">
          {{ rank }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field>
      <input #privilege matInput placeholder="Privilégio" />
    </mat-form-field>
    <button mat-mini-fab (click)="addPrivilege(rankSelected, privilege)">+</button>

<app-list-privilege></app-list-privilege>

  `
})
export class AddPrivilegeComponent implements OnInit {
  ranks = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
"11","12","13","14","15","16","17","18","19","20"];
  constructor(private dataService: DataService) {}

  ngOnInit() {}

  addPrivilege(field1: any, field2: any) {
    if (field1.value && field2.value) this.dataService.addPrivilege(field1.value, field2.value);
    field1.value = "";
    field2.value = "";
  }
}
