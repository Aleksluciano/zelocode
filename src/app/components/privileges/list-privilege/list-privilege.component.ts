import { Privilege } from './../privilege.model';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-list-privilege",
  styles:[ `
    #btDelete {
      color: warn;
    }
  `],
  template: `
    <mat-list>
      <mat-list-item *ngFor="let listPrivilege of listPrivileges">
        <button mat-icon-button (click)="deleteDay(listPrivilege)"><mat-icon>delete</mat-icon></button
        ><strong>{{ listPrivilege.rank }}-</strong> {{ listPrivilege.name }}
      </mat-list-item>
    </mat-list>
  `
})
export class ListPrivilegeComponent implements OnInit {
  listPrivileges: Privilege[];
  sub: any;
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.sub = this.dataService.getAllPrivileges().subscribe(result => {
      this.listPrivileges = result as Privilege[];
      this.cd.detectChanges();
    });
  }

  deleteDay(value) {
    this.dataService.deletePrivilege(value.rank);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
