import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection , DocumentData} from '@angular/fire/compat/firestore';
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
  return categoryDocRef.collection('todos').valueChanges({ idField: 'id' }).pipe(
    map((data: (DocumentData & { id: string;  })[]) => {
      // Map the data to the Todo type
      return data.map(item => ({
        id: item.id,
        isCompleted: item['isCompleted'] || false,
        todo: item['todo'] // Assuming the 'todo' property is available in the DocumentData
        // Map other properties of Todo as needed
      }));
    })
  );
}
updateTodo(catId: string, todoId: string, updatedData: string): Promise<void> {
  const todoDocRef = this.afs.doc(`categories/${catId}/todos/${todoId}`);
  return todoDocRef.update({ todo: updatedData }).then(() => {
    this.toastr.success('Todo Updated Successfully');
  });
  }

  deleteTodo(catId: string, todoId: string) {
    const todoDocRef = this.afs.doc(`categories/${catId}/todos/${todoId}`);
    return todoDocRef.delete().then(() => {
      const categoryDocRef = this.afs.doc(`categories/${catId}`);
      categoryDocRef.get().subscribe((doc: any) => {
        const currentTodoCount = doc.data()?.todoCount || 0; // If todoCount doesn't exist, set it to 0
        categoryDocRef.update({ todoCount: currentTodoCount > 0 ? currentTodoCount - 1 : 0 }); // Decrement the value or set to 0 if it's already 0
        this.toastr.success('Todo Deleted Successfully');
      }, (error: any) => {
        this.toastr.error('Error getting document: ' + error);
      });
    }).catch((error: any) => {
      this.toastr.error('Error deleting Todo: ' + error);
    });
  }

  markCompleted(catId: string, todoId: string): Promise<void> {
    const todoDocRef = this.afs.doc(`categories/${catId}/todos/${todoId}`);
    return todoDocRef.update({ isCompleted: true }).then(() => {
      this.toastr.info('Todo Marked Completed!');
    });
    }
    markUnCompleted(catId: string, todoId: string): Promise<void> {
      const todoDocRef = this.afs.doc(`categories/${catId}/todos/${todoId}`);
      return todoDocRef.update({ isCompleted:false }).then(() => {
        this.toastr.warning('Todo Marked Uncompleted!');
      });
      }

  }
  