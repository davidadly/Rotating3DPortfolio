// Show the loading spinner while the blog posts are being fetched
showLoader();

// Fetch the blog data from the server
fetch("/blog")
  .then((res) => res.json()) // Parse the response as JSON
  .then((data) => {
    // Once data is fetched, remove the loading spinner
    removeLoader();
    // Create and display the blog posts using the fetched data
    createPosts(data.items);
  })
  .catch((err) => {
    // If an error occurs, remove the loading spinner
    removeLoader();
    // Log the error to the console
    console.error(err);
  });

// Function to create the HTML structure for a single blog post card
function createPost(data) {
  // Create an HTML template for the blog post card
  const html = `
      <a href="${data.link}" target="_blank" class="card">
        <div class="card-img_con">
          <img src="${data.imgSrc}" alt="${data.imgAlt}" />
        </div>
        <div class="card-body">
          <h3>${data.title}</h3>
          <p>${data.excerpt}</p>
        </div>
      </a>
    `;
  // Return the generated HTML string
  return html;
}

// Function to create and insert multiple blog post cards into the page
function createPosts(posts) {
  // Select the container where the blog posts will be inserted
  const blogsEl = document.querySelector(".blogs");

  // If there are no posts, exit the function
  if (!posts) return;

  // Loop through each post in the array in reverse order to show the newest first
  posts.reverse().forEach((post) => {
    // Transform the raw post data into the desired format
    const item = transformPost(post);
    // Create the HTML for the post using the transformed data
    const html = createPost(item);
    // Insert the generated HTML into the blog container
    blogsEl.insertAdjacentHTML("beforeend", html);
  });
}

// Function to transform raw post data into the desired format for display
function transformPost(data) {
  // Parse the HTML content of the post into a DOM object
  const html = new DOMParser().parseFromString(data.content, "text/html");
  
  // Extract the source URL of the image from the post's content
  const imgSrc = html.querySelector("figure img").src;
  
  // Extract the alt text of the image or set a default if not available
  const imgAlt = html.querySelector("figure img").alt || "Feature Image";
  
  // Extract a short excerpt from the post's content (first 100 characters of the first paragraph)
  const excerpt = html.querySelector("figure + p").textContent.slice(0, 100);

  // Return an object with the transformed data
  return {
    imgSrc,   // Image source URL
    imgAlt,   // Image alt text
    link: data.link, // Post link
    title: data.title, // Post title
    excerpt, // Short excerpt from the post
  };
}

// Function to show a loading spinner while content is being fetched
function showLoader() {
  // Create the HTML for the loading spinner
  const html = `
  <div class="loader_con">
    <img src="/assets/icons/spinner_nobg.gif" alt="Loading..." />
  </div>
  `;
  // Select the container where the loader will be inserted
  const blogs = document.querySelector(".blogs");
  // Insert the loader HTML into the container
  blogs.insertAdjacentHTML("beforeend", html);
}

// Function to remove the loading spinner once content is loaded
function removeLoader() {
  // Select the loader element
  const loader = document.querySelector(".loader_con");
  // If the loader exists, remove it from the DOM
  if (loader) loader.remove();
}
