import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NewListComponent } from "./new-list.component";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { List } from "../../models/list.model";
import { IListServiceToken } from "../../services/IListService";

describe("NewListComponent", () => {
  let component: NewListComponent;
  let fixture: ComponentFixture<NewListComponent>;

  const mockListService = {
    createList: jasmine.createSpy("createList").and.returnValue(of({ _id: "1", title: "New List" } as List))
  };

  const mockRouter = {
    navigate: jasmine.createSpy("navigate")
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [NewListComponent],
      providers: [
        { provide: IListServiceToken, useValue: mockListService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call createList and navigate after list creation", () => {
    const title = "New List";

    component.createNewList(title);

    expect(mockListService.createList).toHaveBeenCalledWith(title);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/lists", "1"]);
  });

  it("should navigate to the created list after list creation", () => {
    const title = "New List";

    component.createNewList(title);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/lists", "1"]);
  });

});
