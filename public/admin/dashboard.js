const modal = document.querySelector(".modal");
const popup = document.querySelector(".popup");
const form = document.querySelector(".form");
const addModelBtn = document.querySelector("#trigger-popup");

addModelBtn.addEventListener("click", togglePopup);
modal.addEventListener("click", togglePopup);
form.addEventListener("submit", handleSubmit);

function togglePopup() {
  modal.classList.toggle("active");
  popup.classList.toggle("active");
}

async function handleSubmit(e) {
  e.preventDefault();
  const file = document.getElementById("new-model");
  const btn = document.querySelector(".form button");
  const formdata = new FormData();
  formdata.append("file", file.files[0]);

  const orignalText = btn.textContent;
  btn.textContent = "uploading...";
  btn.setAttribute("disabled", "disabled");

  try {
    const res = await fetch("/add-model", {
      method: "POST",
      redirect: "follow",
      headers: {
        token,
      },
      body: formdata,
    });
    await res.json();
    showMsg("New Model added successfully!", true);
  } catch (err) {
    console.error(err);
    showMsg("Something went wrong, try again!", false);
  }

  btn.removeAttribute("disabled");
  btn.textContent = orignalText;
  togglePopup();
}

function showMsg(msg, status) {
  const html = `<div id="msg" class=${
    status ? "success" : "fail"
  }>${msg}</div>`;

  document.body.insertAdjacentHTML("afterBegin", html);
}
