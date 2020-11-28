import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 storedPosts: Post[] = [];

  // tslint:disable-next-line:typedef
 onPostAdded(post) {
   this.storedPosts.push(post);
 }
}
