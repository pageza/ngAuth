import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  // tslint:disable-next-line:variable-name
  constructor(public _posts: PostsService) { }

  ngOnInit(): void {
    this.posts = this._posts.getPosts();
    this.postsSub = this._posts.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
