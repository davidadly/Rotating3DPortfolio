const ShowCaseApp = async () => {
  // here we are getting some elements from dom
  const showcaseCon = document.querySelector(".showcase");
  const modalEl = document.querySelector(".modal");
  const popInfo = document.querySelector(".popup .popup-info");
  const leftArrow = document.querySelector(".popup .left-arrow");
  const rightArrow = document.querySelector(".popup .right-arrow");

  let store;
  try {
    const res = await fetch("/showcase-details");
    const resJson = await res.json();
    store = resJson.reverse();
  } catch (err) {
    console.error(err);
    return;
  }

  // active card
  let activeIndex;

  /**
   * method to create a card
   * @param {*} item
   * @param {*} index
   * @returns  markup
   */
  const generateBlock = (item, index) => {
    return `
    <div class="grid-card">
      <div class="grid-body" data-dir="${item.dir}"" data-ext="${
      item.filetype
    }" data-type="${item.type}" data-index="${index}"">
        ${
          item.type === "video" &&
          `<video src="${item.dir}/fragment-preview.mp4" loop></video>`
        }
        <img src="${item.dir}/thumnail.jpg" />
      </div>
    </div>
  `;
  };

  /**
   * Create the show case grid
   */
  const createShowCase = () => {
    const gridEl = document.querySelector(".showcase-grid");

    store.forEach((item, index) => {
      const markup = generateBlock(item, index);
      gridEl.insertAdjacentHTML("beforeend", markup);
    });
  };

  /**
   * Play preview methods
   * @param  e - event
   */

  const playPreview = (e) => {
    e.target.play();
  };

  /**
   * reset preview methods
   * @param  e - event
   */
  const resetPreview = (e) => {
    e.target.currentTime = 0;
    e.target.pause();
  };

  /**
   * toggle the show full display
   * @param type - is it video or image
   */
  const toggleDisplayItem = (type) => {
    const popupEl = document.querySelector(".popup");

    // activate the model and popup
    modalEl.classList.toggle("active");
    popupEl.classList.toggle("active");

    if (type === "video") {
      // if it's a video show video and hide image
      const el = document.querySelector(".popup video");
      const imgEl = document.querySelector(".popup #content-img");
      el.classList.add("active");
      imgEl.classList.remove("active");
    } else {
      // otherewise do the opposite
      const el = document.querySelector(".popup #content-img");
      const videoEl = document.querySelector(".popup video");
      el.classList.add("active");
      videoEl.classList.remove("active");
      videoEl.pause();
    }
  };

  /**
   * Display the currently selected item
   * @param e  event object
   */

  const displayItem = (e) => {
    // we are extracting info like file path type index etc
    const dir = e.path[1].getAttribute("data-dir");
    const ext = e.path[1].getAttribute("data-ext");
    const type = e.path[1].getAttribute("data-type");
    activeIndex = e.path[1].getAttribute("data-index");

    // element variable will be different deppending on type
    let el;
    if (type === "video") el = document.querySelector(".popup video");
    else el = document.querySelector(".popup-video-con #content-img");

    // to show and to hide the popup
    toggleDisplayItem(type);
    // setting the src
    el.setAttribute("src", `${dir}/original.${ext}`);
    // setting the description
    const pEl = document.querySelector(".popup-info p");
    pEl.textContent = store[activeIndex].desc;
  };

  /**
   * Listening to the events that could occur on each card
   * like clicking, hovering etc
   */
  const addEventLis = () => {
    // videos items
    let items = document.querySelectorAll(".grid-body video");
    // convert dom list to array
    items = Array.from(items);

    // loop through each video and add these even listeners
    items.forEach((item) => {
      item.addEventListener("mouseover", playPreview);
      item.addEventListener("mouseleave", resetPreview);
      item.addEventListener("click", displayItem);
    });

    // fotos
    // same as above
    let itemsImgs = document.querySelectorAll(
      `.grid-body[data-type="img"] img`
    );
    itemsImgs = Array.from(itemsImgs);

    itemsImgs.forEach((item) => {
      item.addEventListener("click", displayItem);
    });
  };

  const updateDisplay = () => {
    let el;

    if (store[activeIndex].type === "video") {
      // if it's a video show video and hide image
      el = document.querySelector(".popup video");
      const imgEl = document.querySelector(".popup #content-img");
      el.classList.add("active");
      imgEl.classList.remove("active");
    } else {
      // otherewise do the opposite
      el = document.querySelector(".popup #content-img");
      const videoEl = document.querySelector(".popup video");
      el.classList.add("active");
      videoEl.classList.remove("active");
      videoEl.pause();
    }

    el.setAttribute(
      "src",
      `${store[activeIndex].dir}/original.${store[activeIndex].filetype}`
    );

    const pEl = document.querySelector(".popup-info p");
    pEl.textContent = store[activeIndex].desc;
  };

  const loadPrevious = () => {
    activeIndex--;
    if (activeIndex < 0) {
      activeIndex = store.length - 1;
    }
    updateDisplay();
  };

  const loadNext = () => {
    activeIndex++;
    if (activeIndex >= store.length) {
      activeIndex = 0;
    }

    updateDisplay();
  };

  //  previous scroll position
  let oldScroll = 0;
  // threshhold when it's goes above this we will show the showcase
  const threshold = window.innerHeight * 0.2;

  const handleWheel = (e) => {
    // current scroll top position
    const st = showcaseCon.scrollTop;

    // only add to previous scroll when the showcase isn't visible
    if (st === 0) {
      oldScroll += e.deltaY;
    }

    // if prev scroll >= threshold then show the show case
    // and set the oldscroll to threshold (we don't want it to go above it)
    if (oldScroll >= threshold) {
      showcaseCon.classList.add("active");
      oldScroll = threshold;
    } else if (oldScroll <= -threshold / 2) {
      // same as above but with opposite
      showcaseCon.classList.remove("active");
      oldScroll = -threshold / 2;
    }
  };

  let touchThreshold = 100;
  let touchStart = 0;
  window.addEventListener("touchstart", (e) => {
    touchStart = e.changedTouches[0].screenY;
  });

  window.addEventListener("touchmove", (e) => {
    const touchEnd = e.changedTouches[0].screenY;
    const hasAlready = showcaseCon.classList.contains("active");

    if (touchStart > touchEnd + touchThreshold) {
      if (!hasAlready) {
        showcaseCon.classList.add("active");
      }
    } else if (touchStart + touchThreshold < touchEnd) {
      const { scrollTop } = showcaseCon;
      if (hasAlready && scrollTop === 0) {
        showcaseCon.classList.remove("active");
      }
    }
  });

  window.addEventListener("touchend", () => {
    touchStart = 0;
  });

  // scrolling
  window.addEventListener("wheel", handleWheel);

  modalEl.addEventListener("click", toggleDisplayItem);
  popInfo.addEventListener("click", toggleDisplayItem);
  leftArrow.addEventListener("click", loadPrevious);
  rightArrow.addEventListener("click", loadNext);

  createShowCase();
  addEventLis();
};

ShowCaseApp();
