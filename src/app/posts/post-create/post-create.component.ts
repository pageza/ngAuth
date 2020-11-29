import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';


// @ts-ignore
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  private mode = 'create';
  private postID: string;
  post: Post;
  // tslint:disable-next-line:variable-name
  constructor(public _posts: PostsService, public _route: ActivatedRoute) {}

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postID')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postID');
        this._posts.getPost(this.postID).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postID = null;
        // this.post = {id: null, title: '', content: ''};
      }
    });
  }

  // tslint:disable-next-line:typedef
  onSavePost(form: NgForm){
    if (form.invalid) { return; }
    if (this.mode === 'create') {
      this._posts.addPost(form.value.title, form.value.content);
    } else {
      this._posts.updatePost(
        this.postID,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
