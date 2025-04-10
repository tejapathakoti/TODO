import { TestBed } from "@angular/core/testing";

import { ListService } from "./list.service";
import { ApiClientService } from "../api-client.service";
import { List } from "../models/list.model";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ListService", () => {
  let service: ListService;
  let apiClientServiceSpy: jasmine.SpyObj<ApiClientService>;

  const mockLists: List[] = [
    { _id: "1", title: "Groceries" },
    { _id: "2", title: "Work" }
  ];
  
  beforeEach(() => {
    apiClientServiceSpy = jasmine.createSpyObj("ApiClientService", ["get", "post", "put", "delete"]);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ListService,
        { provide: ApiClientService, useValue: apiClientServiceSpy }
      ]
    });
    service = TestBed.inject(ListService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should load lists and update subject", () => {
    apiClientServiceSpy.get.and.returnValue(of(mockLists));

    service.loadLists();

    service.lists$.subscribe((lists) => {
      expect(lists).toEqual(mockLists);
    });

    expect(apiClientServiceSpy.get).toHaveBeenCalledWith("lists");
  });

  it("should create a new list and update subject", () => {
    const newList = { _id: "3", title: "New List" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).listsSubject.next([...mockLists]);

    apiClientServiceSpy.post.and.returnValue(of(newList));

    service.createList("New List").subscribe((result) => {
      expect(result).toEqual(newList);
    });

    service.lists$.subscribe((lists) => {
      expect(lists.length).toBe(3);
      expect(lists.find(l => l._id === "3")).toEqual(newList);
    });

    expect(apiClientServiceSpy.post).toHaveBeenCalledWith("lists", { title: "New List" });
  });

  it("should update a list and update subject", () => {
    const updatedList = { _id: "1", title: "Updated Groceries" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).listsSubject.next([...mockLists]);

    apiClientServiceSpy.put.and.returnValue(of(updatedList));

    service.updateList("1", "Updated Groceries").subscribe((result) => {
      expect(result).toEqual(updatedList);
    });

    service.lists$.subscribe((lists) => {
      expect(lists.find(l => l._id === "1")?.title).toBe("Updated Groceries");
    });

    expect(apiClientServiceSpy.put).toHaveBeenCalledWith("lists/1", { title: "Updated Groceries" });
  });

  it("should delete a list and update subject", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).listsSubject.next([...mockLists]);
    apiClientServiceSpy.delete.and.returnValue(of({}));

    service.deleteList("1").subscribe(() => {
      service.lists$.subscribe((lists) => {
        expect(lists.find(l => l._id === "1")).toBeUndefined();
        expect(lists.length).toBe(1);
      });
    });

    expect(apiClientServiceSpy.delete).toHaveBeenCalledWith("lists/1");
  });

  it("should get a list by id", () => {
    const list = { _id: "1", title: "Groceries" };
    apiClientServiceSpy.get.and.returnValue(of(list));

    service.getListById("1").subscribe((result) => {
      expect(result).toEqual(list);
    });

    expect(apiClientServiceSpy.get).toHaveBeenCalledWith("lists/1");
  });

  it("should get tasks for a list", () => {
    const tasks = [{ _id: "t1", _listId: "l1", title: "Task A", completed: false, description: "" }];
    apiClientServiceSpy.get.and.returnValue(of(tasks));

    service.getTasks("1").subscribe((result) => {
      expect(result).toEqual(tasks);
    });

    expect(apiClientServiceSpy.get).toHaveBeenCalledWith("lists/1/tasks");
  });

});
