import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {


  // tslint:disable-next-line:variable-name
  constructor(public _posts: PostsService) {}

  // tslint:disable-next-line:typedef
  onAddPost(form: NgForm){
    if (form.invalid) { return; }
    this._posts.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
