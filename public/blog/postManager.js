import { Post } from './Post.js';

export function renderPosts(blog) {
  const posts = blog.obtenerPosts();
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = ''; // Limpiamos el contenedor de posts

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    
    postElement.innerHTML = `
      <h2>${post.titulo}</h2>
      <p>${post.contenido}</p>
      <small>${post.fecha}</small>
    `;

    postContainer.appendChild(postElement);
  });
}
