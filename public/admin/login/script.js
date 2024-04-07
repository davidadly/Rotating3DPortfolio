const inputEl = document.querySelector("#password");
const form = document.querySelector("form");
const msg = document.querySelector(".msg");

const checkAlreadyLogin = () => {
  const token = localStorage.getItem("token");
  if (token) window.location.pathname = "/admin/dashboard.html";
};

checkAlreadyLogin();

const handleFormSubmit = (e) => {
  e.preventDefault();
  clearMsg();
  const password = inputEl.value;

  if (!password) return showMsg("Password can't be empty", "error");
  if (password.length < 8)
    return showMsg("Password can't be less than 8 characters", "error");

  fetch("/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: "admin", password }),
  })
    .then((res) => {
      if (res.status === 401) return showMsg("Incorrect Password", "error");
      return res.json();
    })
    .then((resJson) => {
      if (resJson) loginSuccess(resJson);
    })
    .catch((err) => {
      console.error(err);
      showMsg("Something went wrong", "error");
    });
};

const loginSuccess = (res) => {
  showMsg("Successfully logged into admin account", "success");
  setTimeout(() => {
    localStorage.setItem("token", res.token);
    window.location.pathname = "/admin/dashboard.html";
  }, 2000);
};

const showMsg = (txt, status) => {
  msg.textContent = txt;
  msg.classList.add(status);
};

const clearMsg = () => {
  msg.textContent = "";
  msg.setAttribute("class", "msg");
};

form.addEventListener("submit", handleFormSubmit);
