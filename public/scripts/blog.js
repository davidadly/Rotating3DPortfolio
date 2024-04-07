showLoader();

fetch("/blog")
  .then((res) => res.json())
  .then((data) => {
    removeLoader();
    createPosts(data.items);
  })
  .catch((err) => {
    removeLoader();
    console.error(err);
  });

function createPost(data) {
  const html = `
      <a href="${data.link}" target="_blank" class="card">
        <div class="card-img_con">
          <img src="${data.imgSrc}" alt="${data.imgAlt}" />
        </div>
        <div class="card-body">
          <h3>${data.title}</h3>
          <p>${data.excerpt}</h3>
        </div>
      </a>
    `;
  return html;
}

function createPosts(posts) {
  const blogsEl = document.querySelector(".blogs");

	if(!posts)
		return;

    posts.forEach((post) => {
      const item = transformPost(post);
      const html = createPost(item);
      blogsEl.insertAdjacentHTML("beforeend", html);
    });
}

function transformPost(data) {
  const html = new DOMParser().parseFromString(data.content, "text/html");
  const imgSrc = html.querySelector("figure img").src;
  const imgAlt = html.querySelector("figure img").alt || "Feature Image";
  const excerpt = html.querySelector("figure + p").textContent.slice(0, 100);

  return {
    imgSrc,
    imgAlt,
    link: data.link,
    title: data.title,
    excerpt,
  };
}

function showLoader() {
  const html = `
  <div class="loader_con">
    <img src="/assets/icons/spinner_nobg.gif" alt="Loading..." />
  </div>
  `;
  const blogs = document.querySelector(".blogs");
  blogs.insertAdjacentHTML("beforeend", html);
}

function removeLoader() {
  const loader = document.querySelector(".loader_con");
  if (loader) loader.remove();
}
