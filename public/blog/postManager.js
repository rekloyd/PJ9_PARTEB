import { Blog } from './Blog.js';
import { Post } from './Post.js';

const blog = new Blog();

// Simulación de carga de posts
blog.agregarPost(new Post("Primer Post", "Este es el contenido del primer post", "2024-04-14"));
blog.agregarPost(new Post("Segundo Post", "Contenido del segundo post interesante", "2024-04-13"));

export function renderPosts(containerId = 'post-container') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  blog.obtenerPosts().forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    postElement.innerHTML = `
      <h2>${post.titulo}</h2>
      <p>${post.contenido}</p>
      <small>${post.fecha}</small>
    `;

    container.appendChild(postElement);
  });
}
