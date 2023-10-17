import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection , AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Category } from "../service/category.model";
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { Todo } from './todo.model'; 
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private categoriesCollection: AngularFirestoreCollection<Category>;
  constructor( private afs: AngularFirestore, private toastr: ToastrService) {
    this.categoriesCollection = this.afs.collection<Category>('categories');
   }

   saveTodo(id: string, data: any) {
    const categoryDocRef = this.afs.doc(`categories/${id}`);
    const todosCollection = categoryDocRef.collection('todos');
    todosCollection.add(data)
      .then((ref: any) => {
        categoryDocRef.get().subscribe((doc: any) => {
          const currentTodoCount = doc.data()?.todoCount || 0; // If todoCount doesn't exist, set it to 0
          categoryDocRef.update({ todoCount: currentTodoCount + 1 }); // Increment the value and update the document
          this.toastr.success('New Todo Saved Successfully');
        }, (error: any) => {
          this.toastr.error('Error getting document: ' + error);
        });
      })
      .catch((error: any) => {
        this.toastr.error('Error saving Todo: ' + error);
      });
  }

  
loadTodos(id:string):Observable<Todo[]> {
  const categoryDocRef = this.afs.doc(`categories/${id}`);
  return categoryDocRef.collection('todos').valueChanges({ idField: 'id' }) as Observable<Todo[]>;
    // const todosCollection = categoryDocRef.collection('todos');
    // todosCollection.valueChanges({ idField: 'id' });
}

  
  }
  
  

