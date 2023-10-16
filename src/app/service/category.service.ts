import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from "./category.model";

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private categoriesCollection: AngularFirestoreCollection<Category>;
  constructor( private afs: AngularFirestore, private toastr: ToastrService) {
    this.categoriesCollection = this.afs.collection<Category>('categories');
   }

  saveCategory(data:any)
  {
    this.categoriesCollection.add(data).then(ref => {
      this.toastr.success("New Category Saved Successfully");
    });
  }

//   loadCategories(): Observable<Category[]> {
//     return this.categoriesCollection.snapshotChanges().pipe(
//       map((actions: DocumentChangeAction<Category>[]) => {
//         return actions.map(action => {
//           const data = action.payload.doc.data();
//           const id = action.payload.doc.id;
//           return { ...data ,id } as Category;
//         });
//       })
//     );
//   }
// }

loadCategories(): Observable<Category[]> {
  return this.categoriesCollection.valueChanges({ idField: 'id' });
}

updateCategory(id:string, updatedData:any){
this.afs.doc('categories/'+id).update({category: updatedData}).then(()=>{
  this.toastr.success("Updated Successfully");
})
}

deleteCategory(id:string)
{
  this.afs.doc('categories/'+ id).delete().then(()=>{
  this.toastr.error("Category Deleted Successfully");
  })
}
}
