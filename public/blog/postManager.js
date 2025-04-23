import { PostDestacado } from './PostDestacado.js'; // Asegúrate de importarlo

export function renderPosts(blog) {
  const posts = blog.obtenerPosts();
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    let extra = '';

    if (post instanceof PostDestacado) {
      extra = `<p><strong>Autor:</strong> ${post.autor}</p>`;
    }

    postElement.innerHTML = `
      <h2>${post.titulo}</h2>
      ${extra}
      <p>${post.contenido}</p>
      <small>${post.fecha}</small>
    `;

    postContainer.appendChild(postElement);
  });
}
