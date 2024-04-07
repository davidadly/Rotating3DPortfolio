const app = async () => {
  const showcaseEl = document.querySelector(".showcase");
  const modalEl = document.querySelector(".modal");
  const popupEl = document.querySelector(".popup");
  const newItemEl = document.querySelector(".new-item-con");
  const addNewItemEl = document.querySelector(".add_new_item");
  const textarea = document.querySelector(".popup textarea");
  const submitBtn = document.querySelector(".submit");
  const closeBtns = document.querySelectorAll(".close-btn");
  const cancelBtn = document.querySelector(".cancel");
  const form = document.getElementById("form");
  const file = document.getElementById("file");
  const foldername = document.getElementById("foldername");
  const info = document.getElementById("info");

  let store, activeIndex;
  try {
    const rawRes = await fetch("/showcase-details");
    const jsonData = await rawRes.json();
    store = jsonData.reverse();
  } catch (err) {
    console.error(err);
    return;
  }

  const generateBlock = (item, index) => {
    return `
    <div class="card" draggable="true" id="card-${index}" data-dir="${item.dir}" data-ext="${item.filetype}" data-type="${item.type}" data-index="${index}">
      <div class="delete_icon" data-dirUrl="${item.dir}">
        <img src="/assets/icons/delete-button.png" />
      </div>
      <div class="card-body" >
        <img src="${item.dir}/thumnail.jpg" draggable="false" class="thumbnail"/>
      </div>
    </div>
  `;
  };

  const createShowCase = () => {
    store.forEach((item, index) => {
      const markup = generateBlock(item, index);
      showcaseEl.insertAdjacentHTML("beforeend", markup);
    });
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const dragStartHandler = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const dropedEL = document.getElementById(data);
    const targetEl = e.target.parentElement;

    const targetImgEl = targetEl.querySelector("img.thumbnail");
    const dropedImgEl = dropedEL.querySelector("img.thumbnail");

    const tmpObj = {
      ...targetEl.dataset,
    };
    tmpObj.imgSrc = targetImgEl.getAttribute("src");

    targetEl.setAttribute("data-dir", dropedEL.dataset.dir);
    targetEl.setAttribute("data-ext", dropedEL.dataset.ext);
    targetEl.setAttribute("data-type", dropedEL.dataset.type);
    targetImgEl.src = dropedImgEl.src;

    dropedImgEl.src = tmpObj.imgSrc;
    dropedEL.setAttribute("data-dir", tmpObj.dir);
    dropedEL.setAttribute("data-ext", tmpObj.ext);
    dropedEL.setAttribute("data-type", tmpObj.type);

    const indexA = tmpObj.index;
    const indexB = dropedEL.dataset.index;
    // updating the store obj
    const tmp = {
      ...store[indexA],
    };
    store[tmpObj.index] = {
      ...store[indexB],
    };
    store[indexB] = tmp;

    // updating backend
    fetch("/showcase-swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token, // global variable
      },
      body: JSON.stringify({
        indexes: [indexA, indexB],
      }),
    }).catch((err) => {
      localStorage.removeItem("token");
      window.location.pathname = "/admin/login";
    });
  };

  const clickHandler = (e) => {
    e.preventDefault();
    // remove previous msg
    const msg = document.querySelector("#msg");
    if (msg) msg.remove();

    modalEl.classList.add("active");
    popupEl.classList.add("active");
    const { index } = e.target.parentElement.dataset;
    textarea.focus();
    textarea.value = store[index].desc;
    activeIndex = index;
  };

  const addNewItemHandler = (e) => {
    e.preventDefault();
    const msg = document.querySelector("#msg");
    if (msg) msg.remove();

    modalEl.classList.add("active");
    newItemEl.classList.add("active");
  };

  const updateInfo = async (e) => {
    e.preventDefault();
    const dir = store[activeIndex].dir;
    const info = textarea.value;
    store[activeIndex].desc = info;

    fetch("/showcase-update-info", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        info,
        dir,
      }),
    })
      .then((res) => {
        if (res.status === 401) throw new Error("invalid token");
        showMsg("successfully updated info", true);
        closeModal({
          preventDefault: () => {},
        });
      })
      .catch((err) => {
        showMsg("something went wrong", false);
        localStorage.removeItem("token");
        window.location.pathname = "/admin/login";
        console.error(err);
      });
  };

  const showMsg = (msg, status) => {
    const html = `<div id="msg" class=${
      status ? "success" : "fail"
    }>${msg}</div>`;

    document.body.insertAdjacentHTML("afterBegin", html);
  };

  const closeModal = (e) => {
    e.preventDefault();
    modalEl.classList.remove("active");
    popupEl.classList.remove("active");
    newItemEl.classList.remove("active");
    textarea.value = "";
    form.reset();
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { dirurl } = e.target.parentElement.dataset;
    const card = document.querySelector(`.card[data-dir="${dirurl}"]`);

    try {
      const res = await fetch("/remove-gallery-item", {
        method: "DELETE",
        body: JSON.stringify({ dirUrl: dirurl }),
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          // eslint-disabled
          token, // global variable
        },
      });
      const resJson = await res.json();
      removeItemFromStore(dirurl);
      showMsg(resJson.message, resJson.error);
      card.remove();
    } catch (err) {
      console.error(err);
    }

    function removeItemFromStore(url) {
      const index = store.findIndex((item) => item.dir === url);
      if (index === -1) return;

      store.splice(index, 1);
    }
  };

  const events = () => {
    let cards = document.querySelectorAll(".card");
    cards = Array.from(cards);
    cards.forEach((card) => {
      card.addEventListener("drop", dropHandler);
      card.addEventListener("dragover", dragOverHandler);
      card.addEventListener("dragstart", dragStartHandler);
      card.addEventListener("click", clickHandler);
    });

    modalEl.addEventListener("click", closeModal);
    const cBs = Array.from(closeBtns);
    cBs.forEach((c) => c.addEventListener("click", closeModal));

    cancelBtn.addEventListener("click", closeModal);
    submitBtn.addEventListener("click", updateInfo);
    addNewItemEl.addEventListener("click", addNewItemHandler);

    // adding delete event listener
    let delBtns = document.querySelectorAll(".delete_icon");
    delBtns = Array.from(delBtns);
    delBtns.forEach((delBtn) => {
      delBtn.addEventListener("click", deleteHandler);
    });
  };

  createShowCase();
  events();

  form.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    const dropFiles = dt.files;

    file.files = dropFiles;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const createBtn = document.getElementById("create-item-btn");
    const originalTxt = createBtn.textContent;
    createBtn.textContent = "uploading...";
    createBtn.setAttribute("disabled", "disabled");

    var formdata = new FormData();
    formdata.append("folder-name", foldername.value);
    formdata.append("info", info.value);
    formdata.append("file", file.files[0]);

    fetch("/add-gallery-item", {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: {
        // eslint-disabled
        token, // global variable
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const cards = document.querySelectorAll(".card");
        showMsg(res.message, true);
        createBtn.textContent = originalTxt;
        createBtn.removeAttribute("disabled");
        closeModal(e);
        store.push(res.item);

        setTimeout(() => {
          showcaseEl.insertAdjacentHTML(
            "afterbegin",
            generateBlock(res.item, cards.length)
          );
          const el = document.getElementById(`card-${cards.length}`);
          el.addEventListener("drop", dropHandler);
          el.addEventListener("dragover", dragOverHandler);
          el.addEventListener("dragstart", dragStartHandler);
          el.addEventListener("click", clickHandler);
        }, 1500);
      })
      .catch((error) => {
        createBtn.textContent = originalTxt;
        createBtn.removeAttribute("disabled");
        console.error("error", error);
      });
  });
};

app();
