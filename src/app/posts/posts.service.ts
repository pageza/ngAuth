import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Post} from './post.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // tslint:disable-next-line:variable-name
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  // tslint:disable-next-line:typedef
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // tslint:disable-next-line:typedef
  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + id
    );
  }
  // tslint:disable-next-line:typedef
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = { id: responseData.post.id, title, content, imagePath: responseData.post.imagePath};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // tslint:disable-next-line:typedef
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = { id, title, content, imagePath: image};
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe( () => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  // tslint:disable-next-line:typedef
  deletePost(postID: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postID)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postID);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
