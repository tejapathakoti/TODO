import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditTaskComponent } from "./edit-task.component";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from "../../models/task.model";
import { FormsModule } from "@angular/forms";
import { ITaskServiceToken } from "../../services/ITaskService";

describe("EditTaskComponent", () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;

  const mockTask: Task = {
    _id: "t1",
    title: "Mock Task",
    description: "Some description",
    completed: false,
    _listId: "l1"
  };

  const mockTaskService = {
    getTask: jasmine.createSpy("getTask").and.returnValue(of(mockTask)),
    updateTask: jasmine.createSpy("updateTask").and.returnValue(of(mockTask))
  };

  const mockActivatedRoute = {
    params: of({ taskId: "t1", listId: "l1" })
  };

  const mockRouter = {
    navigate: jasmine.createSpy("navigate")
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditTaskComponent],
      providers: [
        { provide: ITaskServiceToken, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch task on init and set form values", () => {
    expect(mockTaskService.getTask).toHaveBeenCalledWith("l1", "t1");
    expect(component.taskTitle).toBe("Mock Task");
    expect(component.taskDescription).toBe("Some description");
    expect(component.taskId).toBe("t1");
    expect(component.listId).toBe("l1");
  });

  it("should call updateTask and navigate on updateTask()", () => {
    component.updateTask();
    expect(mockTaskService.updateTask).toHaveBeenCalledWith("l1", "t1", "Mock Task", "Some description");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["lists", "l1"]);
  });

  it("should navigate back to task list on goBackToTaskList()", () => {
    component.goBackToTaskList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/lists", "l1"]);
  });
});
