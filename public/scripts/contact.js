const email = document.getElementById("email");
const subject = document.getElementById("subject");
const msg = document.getElementById("message");
const form = document.querySelector(".contact-form");

const validate = (values) => {
  if (!values.email)
    return { pass: false, msg: "Email is required", el: "email" };

  if (values.email.length < 6 || values.email.indexOf("@") === -1)
    return { pass: false, msg: "Email is not correct", el: "email" };

  if (!values.msg)
    return { pass: false, msg: "Message is required", el: "message" };

  if (values.msg.length < 5)
    return {
      pass: false,
      msg: "Please type something meaningful",
      el: "message",
    };

  return { pass: true };
};

const formSubmitHandler = (e) => {
  e.preventDefault();
  clearMsg();

  const result = validate({ msg: msg.value, email: email.value });
  if (!result.pass) return setError(`#${result.el} + small`, result.msg);
  sending(true);

  fetch("/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: subject.value,
      message: msg.value,
      email: email.value,
    }),
  })
    .then((res) => {
      console.log(res);
      if (res.status === 200) successFeedback();
      else setError("form button + small", resJson.msg);

      sending(false);
    })
    .catch((err) => {
      setError("form button + small", "Something went't wrong");
      sending(false);
    });
};

const sending = (status) => {
  const el = document.querySelector("form button");
  if (status) {
    el.textContent = "SENDING...";
  } else el.textContent = "SEND";
};

const successFeedback = () => {
  const feedback = document.getElementById("feedback-success");
  feedback.classList.add("active");
  setTimeout(() => {
    feedback.classList.remove("active");
  }, 2000);
};

const setError = (selector, msg) => {
  const el = document.querySelector(selector);
  el.textContent = msg;
  el.classList.add("active");
};

const clearMsg = () => {
  let msgs = document.querySelectorAll("form small");
  msgs = Array.from(msgs);
  msgs.forEach((msg) => {
    msg.textContent = "";
    msg.classList.remove("active");
  });
};

form.addEventListener("submit", formSubmitHandler);
