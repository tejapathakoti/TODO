import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { List } from "../../models/list.model";
import { IListService, IListServiceToken } from "../../services/IListService";

@Component({
  selector: "app-edit-list",
  standalone: false,
  templateUrl: "./edit-list.component.html",
  styleUrl: "./edit-list.component.scss"
})
export class EditListComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    @Inject(IListServiceToken) private listService: IListService,
    private router: Router
  ) {  }
  
  listId!: string;
  listTitle!: string;

  /**
   * Lifecycle hook that gets triggered when the component is initialized.
   * It subscribes to the route parameters and fetches the list data 
   * to pre-fill the form fields with the current list details for editing.
   */
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const listId: string | undefined = params["listId"];
      if(listId) {
          this.listId = listId;
        }
      this.listService.getListById(this.listId).subscribe((list: List) => {
        this.listTitle = list.title;
      });
    }); 
  }

  /**
   * Handles the list update operation.
   * It calls the `updateList` method from the ListService to update the list with 
   * the modified title and then navigates back to the updated list view.
   */  
  updateList() {
    this.listService.updateList(this.listId, this.listTitle).subscribe(() => {
      this.router.navigate(["lists", this.listId]);
    });
  }
}
