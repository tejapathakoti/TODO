import { Observable } from "rxjs";
import { Task } from "../models/task.model";
import { InjectionToken } from "@angular/core";

export interface ITaskService {
  tasks$: Observable<Task[]>;

  loadTasks(listId: string): void;
  getTask(listId: string, taskId: string): Observable<Task>;
  createTask(title: string, listId: string, description?: string): Observable<Task>;
  complete(task: Task): Observable<Task>;
  updateTask(listId: string, taskId: string, title: string, description?: string): Observable<Task>;
  deleteTask(listId: string, taskId: string): Observable<Task>;
}

export const ITaskServiceToken = new InjectionToken<ITaskService>("ITaskService");