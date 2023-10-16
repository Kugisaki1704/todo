import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection , AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Category } from "./category.model";
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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
      .then(() => {
        this.afs.doc('categories/'+id).update({todoCount:firebase.firestore.FieldValue.increment(1)});
        this.toastr.success('New Todo Saved Successfully');
      })
      .catch(error => {
        this.toastr.error('Error saving Todo: ' + error);
      });
  }
}
