import { User } from './../user.model';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-list-user",
  styles:[ `
    #btDelete {
      color: warn;
    }
  `],
  template: `
    <mat-list>
      <mat-list-item *ngFor="let listUser of listUsers">
        <button mat-icon-button  (click)="deleteUser(listUser)"><mat-icon>delete</mat-icon></button
        >{{ listUser.name }}
      </mat-list-item>
    </mat-list>
  `
})
export class ListUserComponent implements OnInit {
  listUsers: User[];
  sub: any;
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.sub = this.dataService.getAllUsers().subscribe(result => {
      this.listUsers = result as User[];
      this.cd.detectChanges();
    });
  }

  deleteUser(value) {
    this.dataService.deleteUser(value.name);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
