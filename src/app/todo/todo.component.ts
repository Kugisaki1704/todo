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
  constructor(private todoService:TodoService, private activatedRoute : ActivatedRoute) {}

  ngOnInit():void{
    this.catId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.todoService.loadTodos(this.catId).subscribe((val:any)=>{
      this.todos=val;
      console.log(this.todos);
      
    });
  }

  onSubmit(f:NgForm){
    let todo={
      todo:f.value.todoText,
      isCompleted : false
    }
    this.todoService.saveTodo(this.catId , todo);
    f.resetForm();
  }
}
