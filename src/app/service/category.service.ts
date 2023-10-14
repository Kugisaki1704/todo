import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'rxjs/internal/scheduler/Action';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService) { }

  saveCategory(data:any)
  {
    this.afs.collection('categories').add(data).then(ref => {
      this.toastr.success("New Category Saved Successfully");
    });
  }

  loadCategories()
  {
    return this.afs.collection('categories').observeSnapshotChanges().pipe(
        map(actions => {
            return actions.map(a:any => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id,data};
            })
        })
    );
  }
}
