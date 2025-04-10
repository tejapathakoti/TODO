import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "../../models/list.model";
import { IListServiceToken, IListService } from "../../services/IListService";

@Component({
  selector: "app-new-list",
  standalone: false,
  templateUrl: "./new-list.component.html",
  styleUrl: "./new-list.component.scss"
})
export class NewListComponent implements OnInit {

  constructor(
    @Inject(IListServiceToken) private listService: IListService,
    private router: Router
  ) {  }

  ngOnInit(): void {
  }

  /**
   * Handles the creation of a new list.
   * It triggers the creation process via the ListService and navigates to the created list's detail page.
   * @param title - The title of the new list to be created.
   */
  createNewList(title: string): void {
    this.listService.createList(title).subscribe((list: List) => {
      this.router.navigate([ "/lists", list._id]);
    });
  }
}
