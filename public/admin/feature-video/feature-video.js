const modal = document.querySelector(".modal");
const popup = document.querySelector(".popup");
const popupForm = document.querySelector(".popup .form");
const addItem = document.querySelector(".add_new_item");
let store = [];
let activeFeatureVideo = "";

addItem.addEventListener("click", toggleShowForm);
modal.addEventListener("click", toggleShowForm);
popupForm.addEventListener("submit", handleSubmit);

const showMsg = (msg, status) => {
  const html = `<div id="msg" class=${
    status ? "success" : "fail"
  }>${msg}</div>`;

  document.body.insertAdjacentHTML("afterBegin", html);
};

function toggleShowForm() {
  modal.classList.toggle("active");
  popup.classList.toggle("active");
}

function handleSubmit(e) {
  e.preventDefault();
  const inputFile = document.querySelector(".popup .form input");
  const submitBtn = document.querySelector(".popup .form button");

  const originalTxt = submitBtn.textContent;
  submitBtn.setAttribute("disabled", "disbled");
  submitBtn.textContent = "uploading...";
  const formdata = new FormData();
  formdata.append("file", inputFile.files[0]);
  fetch("/add-feature-video", {
    method: "POST",
    body: formdata,
    redirect: "follow",
    headers: {
      token, // global variable
    },
  })
    .then((res) => res.json())
    .then((resJson) => {
      submitBtn.textContent = originalTxt;
      submitBtn.removeAttribute("disabled");
      toggleShowForm();
      store.unshift(resJson.filename);
      renderAllVideos();
      showMsg("Feature Video added!", true);
    })
    .catch((err) => {
      console.log(err);
      submitBtn.removeAttribute("disabled");
      submitBtn.textContent = originalTxt;
      showMsg("failed to upload", false);
    });
}

function generateHtml(path) {
  const className = path === activeFeatureVideo ? "active" : "";
  return `
  <div class="video-con" id="${path}">
    <img class="check ${className}" src="/assets/icons/check.png" alt="Check" />
    <video src="/assets/feature-videos/${path}" nocontrols mute>
    <video>
  </div>
  `;
}

function addEvents() {
  let elements = document.querySelectorAll(".video-con");
  elements = Array.from(elements);
  elements.forEach((element) => {
    element.addEventListener("click", setFeatureVideo);
  });
}

function renderAllVideos() {
  const featureVideosEl = document.querySelector(".feature-videos");
  featureVideosEl.innerHTML = "";
  const html = store.map((item) => generateHtml(item));
  featureVideosEl.insertAdjacentHTML("afterbegin", html.join(" "));
  addEvents();
}

function getallFeatureVideos() {
  return fetch("/all-feature-video")
    .then((res) => res.json())
    .then((resJson) => {
      store = resJson.videos.reverse();
    })
    .catch((err) => console.error(err));
}

function getCurrentFeatureVideo() {
  return fetch("/feature-video")
    .then((res) => res.json())
    .then((resJson) => {
      activeFeatureVideo = resJson.filename;
    })
    .catch((err) => console.error(err));
}

function setFeatureVideo(e) {
  const { id } = e.target.parentElement;
  if (!id) return;
  fetch("/update-feature-video", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ filename: id }),
  })
    .then((res) => res.json())
    .then((res) => {
      activeFeatureVideo = id;
      renderAllVideos();
    })
    .catch((err) => console.error(err));
}

async function init() {
  await getCurrentFeatureVideo();
  await getallFeatureVideos();
  renderAllVideos();
}

init();
