import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiClientService {

  readonly baseURL;

  constructor(private http: HttpClient) { 
    this.baseURL = "http://localhost:3000";
  }

   /**
   * Sends an HTTP GET request to the specified endpoint.
   * @param uri - The relative API path (e.g., 'lists' or 'lists/123/tasks')
   * @returns Observable<T> - Emits the response body typed as T
   */
  get<T>(uri: string): Observable<T> {
   return this.http.get<T>(`${this.baseURL}/${uri}`);
  }

   /**
   * Sends an HTTP POST request with a payload to the specified endpoint.
   * @param uri - The relative API path
   * @param payload - The request body to send
   * @returns Observable<T> - Emits the created resource or response
   */
  post<T>(uri: string, payload: object): Observable<T> {
    return this.http.post<T>(`${this.baseURL}/${uri}`, payload);
  }

   /**
   * Sends an HTTP PUT request to update data at the specified endpoint.
   * @param uri - The relative API path
   * @param payload - The updated data to send
   * @returns Observable<T> - Emits the updated resource or response
   */
  put<T>(uri: string, payload: object): Observable<T> {
    return this.http.put<T>(`${this.baseURL}/${uri}`, payload);
  }

   /**
   * Sends an HTTP DELETE request to remove a resource.
   * @param uri - The relative API path of the resource to delete
   * @returns Observable<T> - Emits the response from the server
   */
  delete<T>(uri: string): Observable<T> {
    return this.http.delete<T>(`${this.baseURL}/${uri}`);
  }
}
