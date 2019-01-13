import { Exception } from './../exception.model';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-list-exception",
  styles:[ `
    #btDelete {
      color: warn;
    }
  `],
  template: `
    <mat-list>
      <mat-list-item *ngFor="let listException of listExceptions">
        <button mat-icon-button  (click)="deleteException(listException)"><mat-icon>delete</mat-icon></button
        >{{ listException.name }}
      </mat-list-item>
    </mat-list>
  `
})
export class ListExceptionComponent implements OnInit {
  listExceptions: Exception[];
  sub: any;
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.sub = this.dataService.getAllExceptions().subscribe(result => {
      this.listExceptions = result as Exception[];
      this.cd.detectChanges();
    });
  }

  deleteException(value) {
    this.dataService.deleteException(value.name);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
