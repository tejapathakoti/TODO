import { TestBed } from "@angular/core/testing";

import { TaskService } from "./task.service";
import { ApiClientService } from "../api-client.service";
import { Task } from "../models/task.model";
import { HttpClientModule } from "@angular/common/http";
import { of } from "rxjs";

describe("TaskService", () => {
  let service: TaskService;
  let apiClientServiceSpy: jasmine.SpyObj<ApiClientService>;

  const mockTasks: Task[] = [
    { _id: "1", title: "Task 1", completed: false, _listId: "list1", description: "Desc of Task 1" },
    { _id: "2", title: "Task 2", completed: true, _listId: "list1" }
  ];

  beforeEach(() => {
    apiClientServiceSpy = jasmine.createSpyObj("ApiClientService", ["get", "post", "put", "delete"]);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        TaskService,
        { provide: ApiClientService, useValue: apiClientServiceSpy }
      ]
    });
    service = TestBed.inject(TaskService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should load tasks and update tasksSubject", () => {
    apiClientServiceSpy.get.and.returnValue(of(mockTasks));

    service.loadTasks("list1");

    service.tasks$.subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    expect(apiClientServiceSpy.get).toHaveBeenCalledWith("lists/list1/tasks");
  });

  it("should get a single task", () => {
    const task = mockTasks[0];
    apiClientServiceSpy.get.and.returnValue(of(task));

    service.getTask("list1", "1").subscribe((result) => {
      expect(result).toEqual(task);
    });

    expect(apiClientServiceSpy.get).toHaveBeenCalledWith("lists/list1/tasks/1");
  });

  it("should create a task and update tasksSubject", () => {
    const newTask: Task = { _id: "3", title: "New Task", completed: false, _listId: "list1" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).tasksSubject.next([...mockTasks]);

    apiClientServiceSpy.post.and.returnValue(of(newTask));

    service.createTask("New Task", "list1").subscribe((result) => {
      expect(result).toEqual(newTask);
    });

    service.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(3);
      expect(tasks.find(t => t._id === "3")).toEqual(newTask);
    });

    expect(apiClientServiceSpy.post).toHaveBeenCalledWith("lists/list1/tasks", { title: "New Task", description: undefined });
  });

  it("should complete a task and update tasksSubject", () => {
    const taskToComplete = mockTasks[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).tasksSubject.next([...mockTasks]);

    apiClientServiceSpy.put.and.returnValue(of({ ...taskToComplete, completed: true }));

    service.complete(taskToComplete).subscribe();

    service.tasks$.subscribe((tasks) => {
      expect(tasks.find(t => t._id === "1")?.completed).toBe(true);
    });

    expect(apiClientServiceSpy.put).toHaveBeenCalledWith("lists/list1/tasks/1", { completed: true });
  });

  it("should update a task and update tasksSubject", () => {
    const updatedTask: Task = { _id: "1", title: "Updated Task", completed: false, _listId: "list1", description: "desc" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).tasksSubject.next([...mockTasks]);

    apiClientServiceSpy.put.and.returnValue(of(updatedTask));

    service.updateTask("list1", "1", "Updated Task", "desc").subscribe((result) => {
      expect(result).toEqual(updatedTask);
    });

    service.tasks$.subscribe((tasks) => {
      expect(tasks.find(t => t._id === "1")?.title).toBe("Updated Task");
    });

    expect(apiClientServiceSpy.put).toHaveBeenCalledWith("lists/list1/tasks/1", {
      title: "Updated Task",
      description: "desc"
    });
  });

  it("should delete a task and update tasksSubject", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).tasksSubject.next([...mockTasks]);

    apiClientServiceSpy.delete.and.returnValue(of({}));

    service.deleteTask("list1", "1").subscribe();

    service.tasks$.subscribe((tasks) => {
      expect(tasks.find(t => t._id === "1")).toBeUndefined();
      expect(tasks.length).toBe(1);
    });

    expect(apiClientServiceSpy.delete).toHaveBeenCalledWith("lists/list1/tasks/1");
  });
});
