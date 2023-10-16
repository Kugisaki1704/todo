import { Component , OnInit } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent{
  catId : string='';
  constructor(private todoService:TodoService, private activatedRoute : ActivatedRoute) {}

  ngOnInit():void{
    this.catId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.catId);
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
