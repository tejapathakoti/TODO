import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ITaskService, ITaskServiceToken } from "../../services/ITaskService";

@Component({
  selector: "app-new-task",
  standalone: false,
  templateUrl: "./new-task.component.html",
  styleUrl: "./new-task.component.scss"
})
export class NewTaskComponent implements OnInit{
  
  constructor(
    @Inject(ITaskServiceToken) private taskService: ITaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  listId!: string;

  /**
   * Lifecycle hook that gets triggered when the component is initialized.
   * It reads the `listId` from the route parameters to associate the new task with the correct list.
   */
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params["listId"].toString();
      });
  }

  /**
   * Handles the creation of a new task.
   * It triggers the task creation through the TaskService and then navigates back to the task list.
   * @param title - The title of the new task.
   * @param description - The description of the new task which is optional.
   */
  createNewTask(title: string, description?: string) {
    this.taskService.createTask(title, this.listId, description).subscribe(() => {
      this.router.navigate([ "../"], { relativeTo: this.route });

    });
  }
}
