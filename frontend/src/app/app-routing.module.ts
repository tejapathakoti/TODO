import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListComponent } from "./components/list/list.component";
import { NewListComponent } from "./components/new-list/new-list.component";
import { NewTaskComponent } from "./components/new-task/new-task.component";
import { EditListComponent } from "./components/edit-list/edit-list.component";
import { EditTaskComponent } from "./components/edit-task/edit-task.component";

const routes: Routes = [
  { path: "", redirectTo: "lists", pathMatch: "full" },
  { path: "new-list", component: NewListComponent },
  { path: "edit-list/:listId", component: EditListComponent },
  { path: "lists", component: ListComponent },
  { path: "lists/:listId", component: ListComponent },
  { path: "lists/:listId/new-task", component: NewTaskComponent },
  { path: "lists/:listId/edit-task/:taskId", component: EditTaskComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
