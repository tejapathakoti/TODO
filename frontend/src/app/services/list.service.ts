import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ApiClientService } from "../api-client.service";
import { List } from "../models/list.model";
import { Task } from "../models/task.model";
import { IListService } from "./IListService";

@Injectable({
  providedIn: "root"
})
export class ListService implements IListService{

  // BehaviorSubject to store and broadcast the lists
  private listsSubject = new BehaviorSubject<List[]>([]);
  public lists$ = this.listsSubject.asObservable();

  constructor(private apiClientService: ApiClientService) {}

  /**
   * Loads the lists from the backend and stores them in the BehaviorSubject.
   * Usually called when the app initializes or when lists need to be refreshed.
   */
  loadLists(): void {
    this.apiClientService.get<List[]>("lists")
      .subscribe(lists => this.listsSubject.next(lists));
  }

  /**
   * Creates a new list by sending a POST request to the backend.
   * After the list is created, it is added to the locally cached list and broadcasted.
   * @param title - The title of the new list to be created.
   * @returns Observable<List> - Emits the created list object.
   */
  createList(title: string): Observable<List> {
    return this.apiClientService.post<List>("lists", { title }).pipe(
      tap((newList) => {
        const updated = [...this.listsSubject.value, newList];
        this.listsSubject.next(updated);
      })
    );
  }

  /**
   * Updates an existing list by sending a PUT request to the backend.
   * After the update, the list is updated in the locally cached list and broadcasted.
   * @param id - The ID of the list to be updated.
   * @param title - The new title for the list.
   * @returns Observable<List> - Emits the updated list object.
   */
  updateList(id: string, title: string): Observable<List> {
    return this.apiClientService.put<List>(`lists/${id}`, { title }).pipe(
      tap((updatedList) => {
        const updated = this.listsSubject.value.map(list =>
          list._id === id ? updatedList : list
        );
        this.listsSubject.next(updated);
      })
    );
  }

  /**
   * Deletes a list by sending a DELETE request to the backend.
   * After the deletion, the list is removed from the locally cached list and broadcasted.
   * @param id - The ID of the list to be deleted.
   * @returns Observable<List> - Emits the deleted list object.
   */
  deleteList(id: string): Observable<List> {
    return this.apiClientService.delete<List>(`lists/${id}`).pipe(
      tap(() => {
        const updated = this.listsSubject.value.filter(list => list._id !== id);
        this.listsSubject.next(updated);
      })
    );
  }

  /**
   * Fetches a single list by its ID from the backend.
   * @param listId - The ID of the list to retrieve.
   * @returns Observable<List> - Emits the list object.
   */
  getListById(listId: string): Observable<List> {
    return this.apiClientService.get<List>(`lists/${listId}`);
  }

  /**
   * Fetches all tasks associated with a specific list.
   * @param listId - The ID of the list whose tasks need to be fetched.
   * @returns Observable<Task[]> - Emits an array of tasks.
   */
  getTasks(listId: string): Observable<Task[]> {
    return this.apiClientService.get<Task[]>(`lists/${listId}/tasks`);
  }
}
