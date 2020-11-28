import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() { }
  // tslint:disable-next-line:typedef
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // tslint:disable-next-line:typedef
  getPosts() {
    return [...this.posts];
  }
  // tslint:disable-next-line:typedef
  addPost(title: string, content: string) {
    const post: Post = {title, content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
