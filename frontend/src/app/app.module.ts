import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ListComponent } from "./components/list/list.component";

import { HttpClientModule } from "@angular/common/http";
import { NewListComponent } from "./components/new-list/new-list.component";
import { NewTaskComponent } from "./components/new-task/new-task.component";
import { EditListComponent } from "./components/edit-list/edit-list.component";
import { FormsModule } from "@angular/forms";
import { EditTaskComponent } from "./components/edit-task/edit-task.component";
import { TaskService } from "./services/task.service";
import { ITaskServiceToken } from "./services/ITaskService";
import { ListService } from "./services/list.service";
import { IListServiceToken } from "./services/IListService";

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    NewListComponent,
    NewTaskComponent,
    EditListComponent,
    EditTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: ITaskServiceToken, useClass: TaskService },
    { provide: IListServiceToken, useClass: ListService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
