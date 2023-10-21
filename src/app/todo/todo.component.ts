import { Component , OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Todo } from './todo.model';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent{
  catId : string='';
  todos:Todo[]=[];
  todoValue : string = '';
  todoId:string='';
  // isCompleted:boolean="false";
  dataStatus : string='Add';
  constructor(private todoService:TodoService, private activatedRoute : ActivatedRoute) {}

  ngOnInit():void{
    this.catId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.todoService.loadTodos(this.catId).subscribe((val:any)=>{
      this.todos=val;
      console.log(this.todos);
      
    });
  }

  onSubmit(f:NgForm){

    if (this.dataStatus == 'Add')
    {
      let todo={
        todo:f.value.todoText,
        isCompleted : false
      }
      this.todoService.saveTodo(this.catId , todo);
      f.resetForm();
    }
    else if(this.dataStatus == 'Edit')
    {
      this.todoService.updateTodo(this.catId,this.todoId,f.value.todoText);
      f.resetForm();
      this.dataStatus = 'Add';
    }
  }

  onEdit(todo:string , id:string){
    //2 way data bindng method 
    this.todoValue = todo;
    this.dataStatus= 'Edit';
    this.todoId= id;

  }

  onDelete(id:string){
    this.todoService.deleteTodo( this.catId , id);
}

completeTodo(todoId:string)
{
  this.todoService.markCompleted(this.catId ,todoId);
}
uncompleteTodo(todoId:string)
{
  this.todoService.markUnCompleted(this.catId ,todoId);
}
}
