// Import the VirtualUserManager class
import VirtualUserManager from "./virtual-users.js";

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const momentsList = document.querySelector(".moments-list");
  const cameraButton = document.querySelector(".header-camera");
  const backButton = document.querySelector(".header-back"); // Corrected selector

  // 初始化虚拟用户管理器 (though primarily used in post-moment, might be needed for display)
  const userManager = new VirtualUserManager();

  // 添加返回按钮事件 (返回到 index.html)
  if (backButton) {
    backButton.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  } else {
    console.error("Back button not found");
  }

  // 相机按钮点击事件 (跳转到发布页面)
  if (cameraButton) {
    cameraButton.addEventListener("click", function () {
      window.location.href = "post-moment.html";
    });
  } else {
    console.error("Camera button not found");
  }

  // --- Moment Rendering Logic ---

  // 格式化时间
  function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return "刚刚";
    } else if (diff < hour) {
      return Math.floor(diff / minute) + "分钟前";
    } else if (diff < 24 * hour) {
      // Show hours within the same day
      return Math.floor(diff / hour) + "小时前";
    } else if (diff < 48 * hour) {
      // Show "昨天"
      const time = new Date(timestamp);
      return `昨天 ${time.getHours().toString().padStart(2, "0")}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Show MM-DD HH:MM for older posts
      const date = new Date(timestamp);
      return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
  }

  // 渲染点赞用户列表 (Names only)
  function renderLikeUsers(likes) {
    if (!likes || !likes.users || likes.users.length === 0) {
      return ""; // Return empty string if no likes
    }

    const userNames = likes.users.map((user) => user.name).join("、");
    // Ensure the container is visible if there are likes
    return `
      <div class="moment-likes" style="display: flex;">
          <i class="icon-heart"></i>
          <div class="like-users">${userNames}</div>
      </div>
  `;
  }

  // 渲染图片网格
  function renderImageGrid(images) {
    if (!images || images.length === 0) return "";

    const imageItems = images
      .map(
        (imageSrc) =>
          `<div class="image-item"><img src="${imageSrc}" alt="动态图片"></div>`
      )
      .join("");

    // Determine grid class based on image count for potential styling
    let gridClass = "image-grid-";
    if (images.length === 1) gridClass += "1";
    else if (images.length === 2 || images.length === 4)
      gridClass += "2col"; // e.g., 2 columns
    else gridClass += "3col"; // Default to 3 columns

    return `<div class="images ${gridClass}">${imageItems}</div>`;
  }

  // 获取当前用户名和头像 (从 localStorage 或默认值)
  function getCurrentUserInfo() {
    return {
      name: localStorage.getItem("userName") || "微信用户",
      avatar: localStorage.getItem("userAvatar") || "./images/my-avatar.jpg",
    };
  }

  // 渲染单条动态
  function renderMoment(moment) {
    const momentElement = document.createElement("div");
    momentElement.className = "moment-item";
    momentElement.dataset.id = moment.id;

    const currentUser = getCurrentUserInfo();

    // Determine if the current user has liked this moment
    // For this demo, we assume 'isLiked' property is not reliably stored across sessions.
    // We'll use a simple check if the current user's name is in the like list.
    // A more robust solution would involve user IDs.
    let isLikedByCurrentUser =
      moment.likes &&
      moment.likes.users &&
      moment.likes.users.some((user) => user.name === currentUser.name);

    momentElement.innerHTML = `
      <div class="moment-user">
          <div class="avatar">
              <img src="${currentUser.avatar}" alt="头像">
          </div>
          <div class="name">${currentUser.name}</div>
      </div>
      <div class="moment-content">
          <div class="text">${moment.text || ""}</div>
          ${renderImageGrid(moment.images)}
      </div>
      <div class="moment-info">
          <div class="time">${formatTime(moment.timestamp)}</div>
          <div class="actions">
              <i class="icon-heart${
                isLikedByCurrentUser ? "" : "-outline"
              } like-button"></i>
              <i class="icon-comment comment-button"></i>
          </div>
      </div>
      ${renderLikeUsers(moment.likes)}
      <div class="moment-comments">
          <!-- Comments could be rendered here if implemented -->
      </div>
  `;

    // --- Event Listeners for the rendered moment ---
    const likeButton = momentElement.querySelector(".like-button");
    const commentButton = momentElement.querySelector(".comment-button");
    const likesContainer = momentElement.querySelector(".moment-likes"); // Might be null initially

    // Like Button Click
    likeButton.addEventListener("click", () => {
      const moments = JSON.parse(localStorage.getItem("moments") || "[]");
      const momentIndex = moments.findIndex((m) => m.id === moment.id);
      if (momentIndex === -1) return; // Moment not found

      let targetMoment = moments[momentIndex];

      // Initialize likes if it doesn't exist
      if (!targetMoment.likes) {
        targetMoment.likes = { count: 0, users: [] };
      }
      if (!targetMoment.likes.users) {
        targetMoment.likes.users = [];
      }

      const currentUserInfo = getCurrentUserInfo();
      const existingLikeIndex = targetMoment.likes.users.findIndex(
        (user) => user.name === currentUserInfo.name
      ); // Simple name check

      if (existingLikeIndex !== -1) {
        // User already liked -> Unlike
        targetMoment.likes.users.splice(existingLikeIndex, 1);
        targetMoment.likes.count = Math.max(0, targetMoment.likes.count - 1);
        likeButton.classList.remove("icon-heart");
        likeButton.classList.add("icon-heart-outline");
        isLikedByCurrentUser = false;
      } else {
        // User hasn't liked -> Like
        targetMoment.likes.users.push({
          name: currentUserInfo.name /*, id: userId */,
        }); // Add user info
        targetMoment.likes.count++;
        likeButton.classList.remove("icon-heart-outline");
        likeButton.classList.add("icon-heart");
        isLikedByCurrentUser = true;
      }

      // Update localStorage
      localStorage.setItem("moments", JSON.stringify(moments));

      // Update UI for likes display
      const likesSectionHTML = renderLikeUsers(targetMoment.likes);
      const existingLikesContainer =
        momentElement.querySelector(".moment-likes");
      if (existingLikesContainer) {
        if (likesSectionHTML) {
          existingLikesContainer.innerHTML = likesSectionHTML.includes("</i>")
            ? likesSectionHTML.substring(likesSectionHTML.indexOf("</i>") + 4)
            : ""; // Update content after icon
          existingLikesContainer.style.display = "flex"; // Ensure visibility
        } else {
          existingLikesContainer.style.display = "none"; // Hide if no likes
          existingLikesContainer.innerHTML =
            '<i class="icon-heart"></i><div class="like-users"></div>'; // Reset content
        }
      } else if (likesSectionHTML) {
        // If the container didn't exist, create and insert it
        const newLikesContainer = document.createElement("div");
        newLikesContainer.className = "moment-likes";
        newLikesContainer.innerHTML = likesSectionHTML;
        // Insert after moment-info
        momentElement
          .querySelector(".moment-info")
          .insertAdjacentElement("afterend", newLikesContainer);
      }
    });

    // Comment Button Click (Placeholder)
    commentButton.addEventListener("click", () => {
      // Placeholder: Implement comment functionality later
      // e.g., show an input field, handle submission
      alert("评论功能待实现！");
      console.log("Comment button clicked for moment:", moment.id);
    });

    return momentElement;
  }

  // 加载并渲染所有动态
  function loadMoments() {
    if (!momentsList) {
      console.error("Moments list container not found");
      return;
    }
    const moments = JSON.parse(localStorage.getItem("moments") || "[]");
    momentsList.innerHTML = ""; // Clear existing moments
    // Sort moments by timestamp, newest first
    moments.sort((a, b) => b.timestamp - a.timestamp);
    moments.forEach((moment) => {
      momentsList.appendChild(renderMoment(moment));
    });
  }

  // 初始加载
  loadMoments();
});
