import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { NotificationService } from "src/app/services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { Pagination, PaginatedResult } from "../../../models/pagination.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"]
})
export class MemberListComponent implements OnInit {
  public users: User[] = [];
  public pagination: Pagination;
  public user: User = JSON.parse(localStorage.getItem("user"));
  public genderList = [{ value: "male", display: "Males" }, { value: "female", display: "Females" }];
  public userParams: any = {};

  constructor(
    private _notificationService: NotificationService,
    private _route: ActivatedRoute,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.users = data["users"].result;
      this.pagination = data["users"].pagination;
    });

    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 90;
    this.userParams.orderBy = "lastActive";
  }

  public pageChanges(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  public loadUsers() {
    this._userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, this._notificationService.error);
  }

  public resetFilters() {
    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 90;
    this.userParams.orderBy = "lastActive";
    this.loadUsers();
  }
}
