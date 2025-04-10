import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditListComponent } from "./edit-list.component";
import { Router, ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { List } from "../../models/list.model";
import { FormsModule } from "@angular/forms";
import { IListServiceToken } from "../../services/IListService";

describe("EditListComponent", () => {
  let component: EditListComponent;
  let fixture: ComponentFixture<EditListComponent>;

  const mockListService = {
    getListById: jasmine.createSpy("getListById").and.returnValue(of({ _id: "1", title: "Groceries" } as List)),
    updateList: jasmine.createSpy("updateList").and.returnValue(of({ _id: "1", title: "Updated Groceries" } as List))
  };

  const mockRouter = {
    navigate: jasmine.createSpy("navigate")
  };

  const mockActivatedRoute = {
    params: of({ listId: "1" })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditListComponent],
      providers: [
        { provide: IListServiceToken, useValue: mockListService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should retrieve list details and set listTitle on init", () => {
    expect(mockListService.getListById).toHaveBeenCalledWith("1");
    expect(component.listTitle).toBe("Groceries");
  });

  it("should call updateList and navigate after updating the list", () => {
    component.listTitle = "Updated Groceries";

    component.updateList();

    expect(mockListService.updateList).toHaveBeenCalledWith("1", "Updated Groceries");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["lists", "1"]);
  });

  it("should navigate back to the list after updating it", () => {
    component.listTitle = "Updated Groceries";

    component.updateList();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["lists", "1"]);
  });
});
