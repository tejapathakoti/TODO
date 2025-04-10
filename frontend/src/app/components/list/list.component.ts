import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Task } from "../../models/task.model";
import { List } from "../../models/list.model";
import { Observable } from "rxjs";
import { ITaskService, ITaskServiceToken } from "../../services/ITaskService";
import { IListService, IListServiceToken } from "../../services/IListService";

@Component({
  selector: "app-list",
  standalone: false,
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {

  // Observable for lists from ListService
  lists$!: Observable<List[]>;
  // Observable for tasks from TaskService
  tasks$!: Observable<Task[]>;
  
  selectedListId!: string;
  completedCount = 0;
  remainingCount = 0;


  constructor(
    @Inject(IListServiceToken) private listService: IListService,
    @Inject(ITaskServiceToken) private taskService: ITaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * On component initialization:
   * - Loads all the lists via the ListService.
   * - Subscribes to the route parameters to get the selected listId.
   * - Loads tasks for the selected list and tracks the completed/remaining task count.
   */
  ngOnInit() {
    // Load all lists initially
    this.listService.loadLists();
    this.lists$ = this.listService.lists$;

    this.route.params.subscribe((params: Params) => {
      const listId: string = params["listId"];
      if (listId) {
        this.selectedListId = listId;
        this.taskService.loadTasks(listId);
        this.tasks$ = this.taskService.tasks$;

        this.tasks$.subscribe((tasks: Task[]) => {
        this.completedCount = tasks.filter(task => task.completed).length;
        this.remainingCount = tasks.filter(task => !task.completed).length;
      });
      }
    });
  }

  /**
   * Handles the task completion toggle when a user clicks on a task.
   * It updates the task's 'completed' status both locally and on the backend.
   * @param task - The task that was clicked and toggled for completion
   */
  onTaskClicked(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  /**
   * Handles the deletion of the selected list. 
   * After deletion, it navigates back to the lists overview page.
   */
  onDeleteListClicked() {
    this.listService.deleteList(this.selectedListId).subscribe(() => {
      this.router.navigate(["/lists"]);
    });
  }

  /**
   * Handles the deletion of a specific task.
   * After deletion, it logs a message to the console.
   * @param id - The ID of the task to delete
   */
  onDeleteTaskClicked(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log("Task Deleted");
    });
  }
}
