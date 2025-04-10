import { Observable } from "rxjs";
import { List } from "../models/list.model";
import { Task } from "../models/task.model";
import { InjectionToken } from "@angular/core";

export interface IListService {
  lists$: Observable<List[]>;

  loadLists(): void;
  createList(title: string): Observable<List>;
  updateList(id: string, title: string): Observable<List>;
  deleteList(id: string): Observable<List>;
  getListById(listId: string): Observable<List>;
  getTasks(listId: string): Observable<Task[]>;
}

export const IListServiceToken = new InjectionToken<IListService>("IListService");
