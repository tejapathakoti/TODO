import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListComponent } from "./list.component";
import { List } from "../../models/list.model";
import { of } from "rxjs";
import { Task } from "../../models/task.model";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { ITaskServiceToken } from "../../services/ITaskService";
import { IListServiceToken } from "../../services/IListService";

describe("ListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockListService = {
    loadLists: jasmine.createSpy("loadLists"),
    lists$: of([{ _id: "1", title: "Groceries" }] as List[]),
    deleteList: jasmine.createSpy("deleteList").and.returnValue(of(null))
  };

  const mockTaskService = {
    loadTasks: jasmine.createSpy("loadTasks"),
    tasks$: of([{ _id: "101", title: "Buy milk", completed: false }] as Task[]),
    complete: jasmine.createSpy("complete").and.returnValue(of(null)),
    deleteTask: jasmine.createSpy("deleteTask").and.returnValue(of(null))
  };

  const mockActivatedRoute = {
    params: of({ listId: "1" })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: IListServiceToken, useValue: mockListService },
        { provide: ITaskServiceToken, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should call loadLists on init", () => {
    expect(mockListService.loadLists).toHaveBeenCalled();
  });

  it("should set selectedListId from route params and load tasks", () => {
    expect(component.selectedListId).toBe("1");
    expect(mockTaskService.loadTasks).toHaveBeenCalledWith("1");
  });

  it("should complete a task when onTaskClicked is called", () => {
    const task: Task = {
      _id: "101", title: "Buy milk", completed: false,
      _listId: ""
    };
    component.onTaskClicked(task);
    expect(mockTaskService.complete).toHaveBeenCalledWith(task);
  });

  it("should delete the selected list", () => {
    component.selectedListId = "1";
    component.onDeleteListClicked();
    expect(mockListService.deleteList).toHaveBeenCalledWith("1");
  });

  it("should delete a task", () => {
    component.selectedListId = "1";
    component.onDeleteTaskClicked("101");
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith("1", "101");
  });
});
