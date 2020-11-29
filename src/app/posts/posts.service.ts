import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Post} from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }
  // tslint:disable-next-line:typedef
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // tslint:disable-next-line:typedef
  getPosts() {
    this._http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // tslint:disable-next-line:typedef
  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }
  // tslint:disable-next-line:typedef
  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this._http
      .post<{ message: string, postID: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        post.id = responseData.postID;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  // tslint:disable-next-line:typedef
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content};
    this._http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe( response => {
        console.log(response);
      });
  }
  // tslint:disable-next-line:typedef
  deletePost(postID: string) {
    this._http.delete('http://localhost:3000/api/posts/' + postID)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postID);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
