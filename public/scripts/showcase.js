// The main ShowCaseApp function, defined as an async function to allow for awaiting fetch requests
const ShowCaseApp = async () => {
  // Selecting important DOM elements for later use
  const showcaseCon = document.querySelector(".showcase");
  const modalEl = document.querySelector(".modal");
  const popInfo = document.querySelector(".popup .popup-info");
  const leftArrow = document.querySelector(".popup .left-arrow");
  const rightArrow = document.querySelector(".popup .right-arrow");

  // Variable to store the fetched showcase data
  let store;
  try {
    // Fetching showcase details from the server
    const res = await fetch("/showcase-details");
    const resJson = await res.json();
    // Reversing the order of the fetched data
    store = resJson.reverse();
  } catch (err) {
    // Logging any errors that occur during fetch and exiting the function
    console.error(err);
    return;
  }

  // Variable to keep track of the currently active showcase item
  let activeIndex;

  /**
   * Generates HTML for a showcase item
   * @param {Object} item - The item data
   * @param {number} index - The index of the item in the store array
   * @returns {string} HTML markup for the item
   */
  const generateBlock = (item, index) => {
    return `
    <div class="grid-card">
      <div class="grid-body" data-dir="${item.dir}" data-ext="${item.filetype}" data-type="${item.type}" data-index="${index}">
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
   * Creates the showcase grid by generating and inserting HTML for each item
   */
  const createShowCase = () => {
    const gridEl = document.querySelector(".showcase-grid");

    store.forEach((item, index) => {
      const markup = generateBlock(item, index);
      gridEl.insertAdjacentHTML("beforeend", markup);
    });
  };

  /**
   * Plays the preview video on mouseover
   * @param {Event} e - The event object
   */
  const playPreview = (e) => {
    e.target.play();
  };

  /**
   * Resets the preview video on mouseleave
   * @param {Event} e - The event object
   */
  const resetPreview = (e) => {
    e.target.currentTime = 0;
    e.target.pause();
  };

  /**
   * Toggles the full display of an item
   * @param {string} type - The type of item ('video' or 'img')
   */
  const toggleDisplayItem = (type) => {
    const popupEl = document.querySelector(".popup");

    // Toggle active classes for modal and popup
    modalEl.classList.toggle("active");
    popupEl.classList.toggle("active");

    if (type === "video") {
      // If it's a video, show video and hide image
      const el = document.querySelector(".popup video");
      const imgEl = document.querySelector(".popup #content-img");
      el.classList.add("active");
      imgEl.classList.remove("active");
    } else {
      // If it's an image, show image and hide video
      const el = document.querySelector(".popup #content-img");
      const videoEl = document.querySelector(".popup video");
      el.classList.add("active");
      videoEl.classList.remove("active");
      videoEl.pause();
    }
  };

  /**
   * Displays the selected item in full view
   * @param {Event} e - The event object
   */
  const displayItem = (e) => {
    // Extracting data attributes from the clicked element
    const dir = e.path[1].getAttribute("data-dir");
    const ext = e.path[1].getAttribute("data-ext");
    const type = e.path[1].getAttribute("data-type");
    activeIndex = e.path[1].getAttribute("data-index");

    // Selecting the appropriate element based on the item type
    let el;
    if (type === "video") el = document.querySelector(".popup video");
    else el = document.querySelector(".popup-video-con #content-img");

    // Toggle the display
    toggleDisplayItem(type);
    // Set the source of the media element
    el.setAttribute("src", `${dir}/original.${ext}`);
    // Update the description
    const pEl = document.querySelector(".popup-info p");
    pEl.textContent = store[activeIndex].desc;
  };

  /**
   * Adds event listeners to showcase items
   */
  const addEventLis = () => {
    // Select all video items
    let items = document.querySelectorAll(".grid-body video");
    items = Array.from(items);

    // Add event listeners to each video item
    items.forEach((item) => {
      item.addEventListener("mouseover", playPreview);
      item.addEventListener("mouseleave", resetPreview);
      item.addEventListener("click", displayItem);
    });

    // Select all image items
    let itemsImgs = document.querySelectorAll(`.grid-body[data-type="img"] img`);
    itemsImgs = Array.from(itemsImgs);

    // Add click event listener to each image item
    itemsImgs.forEach((item) => {
      item.addEventListener("click", displayItem);
    });
  };

  /**
   * Updates the display for the current active item
   */
  const updateDisplay = () => {
    let el;

    if (store[activeIndex].type === "video") {
      // If it's a video, show video and hide image
      el = document.querySelector(".popup video");
      const imgEl = document.querySelector(".popup #content-img");
      el.classList.add("active");
      imgEl.classList.remove("active");
    } else {
      // If it's an image, show image and hide video
      el = document.querySelector(".popup #content-img");
      const videoEl = document.querySelector(".popup video");
      el.classList.add("active");
      videoEl.classList.remove("active");
      videoEl.pause();
    }

    // Update the source of the media element
    el.setAttribute(
      "src",
      `${store[activeIndex].dir}/original.${store[activeIndex].filetype}`
    );

    // Update the description
    const pEl = document.querySelector(".popup-info p");
    pEl.textContent = store[activeIndex].desc;
  };

  /**
   * Loads the previous item in the showcase
   */
  const loadPrevious = () => {
    activeIndex--;
    if (activeIndex < 0) {
      activeIndex = store.length - 1;
    }
    updateDisplay();
  };

  /**
   * Loads the next item in the showcase
   */
  const loadNext = () => {
    activeIndex++;
    if (activeIndex >= store.length) {
      activeIndex = 0;
    }
    updateDisplay();
  };

  // Variable to store the previous scroll position
  let oldScroll = 0;
  // Threshold for showcase activation (20% of window height)
  const threshold = window.innerHeight * 0.2;

  /**
   * Handles wheel events for scroll-based showcase activation
   * @param {WheelEvent} e - The wheel event object
   */
  const handleWheel = (e) => {
    // Get current scroll position
    const st = showcaseCon.scrollTop;

    // Only add to previous scroll when the showcase isn't visible
    if (st === 0) {
      oldScroll += e.deltaY;
    }

    // If previous scroll >= threshold, show the showcase
    if (oldScroll >= threshold) {
      showcaseCon.classList.add("active");
      oldScroll = threshold;
    } else if (oldScroll <= -threshold / 2) {
      // If scrolled up enough, hide the showcase
      showcaseCon.classList.remove("active");
      oldScroll = -threshold / 2;
    }
  };

  // Variables for touch-based showcase activation
  let touchThreshold = 100;
  let touchStart = 0;

  // Touch start event listener
  window.addEventListener("touchstart", (e) => {
    touchStart = e.changedTouches[0].screenY;
  });

  // Touch move event listener
  window.addEventListener("touchmove", (e) => {
    const touchEnd = e.changedTouches[0].screenY;
    const hasAlready = showcaseCon.classList.contains("active");

    if (touchStart > touchEnd + touchThreshold) {
      // If swiped up enough, show the showcase
      if (!hasAlready) {
        showcaseCon.classList.add("active");
      }
    } else if (touchStart + touchThreshold < touchEnd) {
      // If swiped down enough, hide the showcase
      const { scrollTop } = showcaseCon;
      if (hasAlready && scrollTop === 0) {
        showcaseCon.classList.remove("active");
      }
    }
  });

  // Touch end event listener
  window.addEventListener("touchend", () => {
    touchStart = 0;
  });

  // Add wheel event listener for scroll-based activation
  window.addEventListener("wheel", handleWheel);

  // Add click event listeners for modal, popup info, and navigation arrows
  modalEl.addEventListener("click", toggleDisplayItem);
  popInfo.addEventListener("click", toggleDisplayItem);
  leftArrow.addEventListener("click", loadPrevious);
  rightArrow.addEventListener("click", loadNext);

  // Initialize the showcase
  createShowCase();
  addEventLis();
};

// Execute the ShowCaseApp
ShowCaseApp();