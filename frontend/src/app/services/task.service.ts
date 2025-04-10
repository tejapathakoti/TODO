import { Injectable } from "@angular/core";
import { ApiClientService } from "../api-client.service";
import { Task } from "../models/task.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ITaskService } from "./ITaskService";

@Injectable({
  providedIn: "root"
})
export class TaskService implements ITaskService {

  // A BehaviorSubject to hold the tasks array for the current list.
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private apiClientService: ApiClientService) { }

  /**
   * Fetches tasks for a specific list and updates the BehaviorSubject.
   * This method is used to load all tasks for a list, typically called when a list is viewed.
   * @param listId - The ID of the list whose tasks need to be fetched.
   */
  loadTasks(listId: string): void {
    this.apiClientService.get<Task[]>(`lists/${listId}/tasks`).subscribe((tasks) => {
      this.tasksSubject.next(tasks);  // Emit new tasks to all subscribers.
    });
  }

   /**
   * Fetches a single task by its ID from the backend.
   * @param listId - The ID of the list containing the task.
   * @param taskId - The ID of the task to fetch.
   * @returns Observable<Task> - Emits the requested task object.
   */
  getTask(listId: string, taskId: string): Observable<Task> {
     return this.apiClientService.get<Task>(`lists/${listId}/tasks/${taskId}`);
  }

  /**
   * Creates a new task for a specified list and updates the BehaviorSubject.
   * @param title - The title of the new task.
   * @param listId - The ID of the list the task belongs to.
   * @param description - (Optional) The description of the new task.
   * @returns Observable<Task> - Emits the created task object.
   */
  createTask(title: string, listId: string,  description?: string): Observable<Task> {
    return this.apiClientService.post<Task>(`lists/${listId}/tasks`, { title, description }).pipe(
      tap((newTask: Task) => {
        const updatedTasks = [...this.tasksSubject.value, newTask];
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  /**
   * Marks a task as completed or incomplete and updates the BehaviorSubject.
   * @param task - The task to be marked as completed/incomplete.
   * @returns Observable<Task> - Emits the updated task object.
   */
  complete(task: Task): Observable<Task> {
    return this.apiClientService.put<Task>(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    }).pipe(
      tap(() => {
        const updatedTasks = this.tasksSubject.value.map(t =>
          t._id === task._id ? { ...t, completed: !t.completed } : t
        );
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  /**
   * Updates an existing task and updates the BehaviorSubject.
   * @param listId - The ID of the list containing the task.
   * @param taskId - The ID of the task to be updated.
   * @param title - The updated title for the task.
   * @param description - (Optional) The updated description for the task.
   * @returns Observable<Task> - Emits the updated task object.
   */
  updateTask(listId: string, taskId: string, title: string, description?: string): Observable<Task> {
    return this.apiClientService.put<Task>(`lists/${listId}/tasks/${taskId}`, { title, description }).pipe(
      tap((updatedTask) => {
        const updatedTasks = this.tasksSubject.value.map(t =>
          t._id === taskId ? { ...t, title: updatedTask.title, description: updatedTask.description } : t
        );
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  /**
   * Deletes a task from the list and updates the BehaviorSubject.
   * @param listId - The ID of the list containing the task.
   * @param taskId - The ID of the task to delete.
   * @returns Observable<Task> - Emits the deleted task object.
   */
  deleteTask(listId: string, taskId: string): Observable<Task> {
    return this.apiClientService.delete<Task>(`lists/${listId}/tasks/${taskId}`).pipe(
      tap(() => {
        const updatedTasks = this.tasksSubject.value.filter(t => t._id !== taskId);
        this.tasksSubject.next(updatedTasks); 
      })
    );
  }
}
