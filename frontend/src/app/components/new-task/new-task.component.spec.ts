import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewTaskComponent } from "./new-task.component";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { ITaskServiceToken } from "../../services/ITaskService";

describe("NewTaskComponent", () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;

  const mockTaskService = {
    createTask: jasmine.createSpy("createTask").and.returnValue(of(null))
  };

  const mockActivatedRoute = {
    params: of({ listId: "1" })
  };

  const mockRouter = {
    navigate: jasmine.createSpy("navigate")
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NewTaskComponent],
      providers: [
        { provide: ITaskServiceToken, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set listId from route params", () => {
    expect(component.listId).toBe("1");
  });

  it("should call createTask and navigate after task creation", () => {
    const title = "New Task";
    const description = "Description for new task";

    component.createNewTask(title, description);

    expect(mockTaskService.createTask).toHaveBeenCalledWith(title, "1", description);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["../"], { relativeTo: mockActivatedRoute });
  });

  it("should navigate to the list when task creation is successful", () => {
    const title = "New Task";
    const description = "Description for new task";

    component.createNewTask(title, description);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["../"], { relativeTo: mockActivatedRoute });
  });
});
