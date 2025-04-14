import { Post } from './Post.js';

export class Blog {
  constructor() {
    this.posts = [];
  }

  agregarPost(post) {
    this.posts.push(post);
  }

  obtenerPosts() {
    return this.posts;
  }
}
