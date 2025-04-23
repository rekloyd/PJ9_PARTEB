import { Post } from './Post.js';

export class PostDestacado extends Post {
  constructor(titulo, contenido, fecha, autor) {
    super(titulo, contenido, fecha);
    this.autor = autor;
  }
}
