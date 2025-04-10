import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Task } from "../../models/task.model";
import { ITaskService, ITaskServiceToken } from "../../services/ITaskService";

@Component({
  selector: "app-edit-task",
  standalone: false,
  templateUrl: "./edit-task.component.html",
  styleUrl: "./edit-task.component.scss"
})
export class EditTaskComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    @Inject(ITaskServiceToken) private taskService: ITaskService,
    private router: Router) {  }
  
  taskId!: string;
  listId!: string;

  taskTitle: string = "";
  taskDescription: string = "";

   /**
   * Lifecycle hook that gets triggered when the component is initialized.
   * It subscribes to the route parameters, captures `taskId` and `listId` from the URL, 
   * and fetches the current task details to pre-fill the form fields for editing.
   */
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const taskId: string | undefined = params["taskId"];
      const listId: string = params["listId"];
      if(taskId) {
          this.taskId = taskId;
          this.listId = listId;
        }

      this.taskService.getTask(this.listId, this.taskId).subscribe((task: Task) => {
        this.taskTitle = task.title;
        this.taskDescription = task.description || "";
      });
      }); 
  }

  /**
   * Handles the task update operation. 
   * It calls the `updateTask` method of the TaskService to update the task 
   * with the modified title and description, and then navigates back to the task list page.
   */  
  updateTask() {
      this.taskService.updateTask(this.listId, this.taskId, this.taskTitle, this.taskDescription).subscribe(() => {
        this.router.navigate(["lists", this.listId]);
      });
    }

  /**
   * Navigates back to the task list without saving any changes.
   * This can be triggered if the user decides to cancel the editing.
   */
    goBackToTaskList() {
      this.router.navigate(["/lists", this.listId]);
    }
    
}
