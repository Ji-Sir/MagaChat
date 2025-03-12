// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const momentsList = document.querySelector(".moments-list");
  const cameraButton = document.querySelector(".header-camera");
  const backButton = document.querySelector(".header-back");

  // 初始化虚拟用户管理器
  const userManager = new VirtualUserManager();

  // 返回按钮点击事件
  backButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });

  // 相机按钮点击事件（跳转到发布页面）
  cameraButton.addEventListener("click", function () {
    window.location.href = "post-moment.html";
  });

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
    } else if (diff < day) {
      return Math.floor(diff / hour) + "小时前";
    } else {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  }

  // 渲染点赞用户列表
  function renderLikeUsers(likes) {
    if (!likes || !likes.users || likes.users.length === 0) return "";

    const userNames = likes.users.map((user) => user.name).join("、");
    return `
            <div class="moment-likes">
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
        (image) =>
          `<div class="image-item"><img src="${image}" alt="动态图片"></div>`
      )
      .join("");

    return `<div class="images image-grid-${images.length}">${imageItems}</div>`;
  }

  // 渲染单条动态
  function renderMoment(moment) {
    const momentElement = document.createElement("div");
    momentElement.className = "moment-item";
    momentElement.dataset.id = moment.id;

    momentElement.innerHTML = `
            <div class="moment-user">
                <div class="avatar">
                    <img src="./images/my-avatar.jpg" alt="头像">
                </div>
                <div class="name">微信用户</div>
            </div>
            <div class="moment-content">
                <div class="text">${moment.text}</div>
                ${renderImageGrid(moment.images)}
            </div>
            <div class="moment-info">
                <div class="time">${formatTime(moment.timestamp)}</div>
                <div class="actions">
                    <i class="icon-heart${
                      moment.isLiked ? "" : "-outline"
                    }"></i>
                </div>
            </div>
            ${renderLikeUsers(moment.likes)}
        `;

    // 绑定点赞事件
    const likeButton = momentElement.querySelector(".actions i");
    likeButton.addEventListener("click", () => {
      moment.isLiked = !moment.isLiked;
      if (moment.isLiked) {
        // 从虚拟用户池中随机选择一个用户点赞
        const availableUsers = userManager.users.filter(
          (user) => !moment.likes.users.some((u) => u.id === user.id)
        );
        if (availableUsers.length > 0) {
          const randomUser =
            availableUsers[Math.floor(Math.random() * availableUsers.length)];
          moment.likes.users.push(randomUser);
          moment.likes.count++;
        }
      } else {
        // 移除最后一个点赞用户
        if (moment.likes.users.length > 0) {
          moment.likes.users.pop();
          moment.likes.count--;
        }
      }

      // 更新存储
      const moments = JSON.parse(localStorage.getItem("moments") || "[]");
      const index = moments.findIndex((m) => m.id === moment.id);
      if (index !== -1) {
        moments[index] = moment;
        localStorage.setItem("moments", JSON.stringify(moments));
      }

      // 更新UI
      likeButton.className = `icon-heart${moment.isLiked ? "" : "-outline"}`;
      const likesContainer = momentElement.querySelector(".moment-likes");
      if (likesContainer) {
        likesContainer.innerHTML = renderLikeUsers(moment.likes);
      }
    });

    return momentElement;
  }

  // 加载并渲染所有动态
  function loadMoments() {
    const moments = JSON.parse(localStorage.getItem("moments") || "[]");
    momentsList.innerHTML = "";
    moments.forEach((moment) => {
      momentsList.appendChild(renderMoment(moment));
    });
  }

  // 初始加载
  loadMoments();

  // 绑定朋友圈交互事件
  function bindMomentEvents(momentItem) {
    const heartIcon = momentItem.querySelector(".fa-heart-o");
    const commentIcon = momentItem.querySelector(".fa-comment-o");
    const likesSection = momentItem.querySelector(".moment-likes");
    const commentsSection = momentItem.querySelector(".moment-comments");

    // 点赞功能
    heartIcon.addEventListener("click", function () {
      this.classList.toggle("fa-heart-o");
      this.classList.toggle("fa-heart");
      this.style.color = this.classList.contains("fa-heart")
        ? "#f43530"
        : "#666";

      if (this.classList.contains("fa-heart")) {
        likesSection.style.display = "flex";
        // 添加当前用户头像到点赞列表
        const userAvatar = document.createElement("img");
        userAvatar.src = "./images/my-avatar.jpg";
        userAvatar.alt = "头像";
        likesSection.querySelector(".like-users").appendChild(userAvatar);
      } else {
        // 移除当前用户头像
        const avatars = [...likesSection.querySelectorAll("img")];
        if (avatars.length > 0) {
          avatars[avatars.length - 1].remove();
          if (avatars.length === 1) {
            likesSection.style.display = "none";
          }
        }
      }
    });

    // 评论功能
    commentIcon.addEventListener("click", function () {
      const commentText = prompt("请输入评论内容：");
      if (commentText && commentText.trim() !== "") {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";
        commentDiv.innerHTML = `
                    <span class="comment-user">微信用户</span>：${commentText.trim()}
                `;
        commentsSection.appendChild(commentDiv);
      }
    });
  }

  // 为现有的朋友圈项绑定事件
  document.querySelectorAll(".moment-item").forEach(bindMomentEvents);

  // 生成点赞用户头像和名称
  function generateLikeUsers(settings) {
    const avatars = [];
    const defaultAvatars = [
      "avatar1.jpg",
      "avatar2.jpg",
      "avatar3.jpg",
      "avatar4.jpg",
      "avatar5.jpg",
    ];
    const defaultNames = ["张三", "李四", "王五", "赵六", "孙七"];

    for (let i = 0; i < settings.count; i++) {
      const avatarIndex = i % defaultAvatars.length;
      avatars.push(`
                <div class="like-user" title="${
                  settings.names ? settings.names[i] : defaultNames[avatarIndex]
                }">
                    <img src="./images/${
                      settings.avatars
                        ? settings.avatars[i]
                        : defaultAvatars[avatarIndex]
                    }" alt="头像">
                </div>
            `);
    }
    return avatars.join("");
  }

  // 发布新动态按钮点击事件
  cameraButton.addEventListener("click", function () {
    const text = prompt("请输入动态内容：");
    if (text && text.trim() !== "") {
      const likeCount = parseInt(prompt("请设置点赞数量（0-10）：") || "0");
      let likeSettings = null;

      if (likeCount > 0 && likeCount <= 10) {
        const names = [];
        const avatars = [];

        for (let i = 0; i < likeCount; i++) {
          const name =
            prompt(`请输入第${i + 1}个点赞者的名称：`) || `用户${i + 1}`;
          names.push(name);
          avatars.push(`avatar${(i % 7) + 1}.jpg`);
        }
        createMomentPost(text.trim(), null, likeSettings);
      }
    }

    likeSettings = {
      count: likeCount,
      names: names,
      avatars: avatars,
    };
    createMomentPost(text.trim(), null, likeSettings);
  });

  createMomentPost(text.trim(), null, likeSettings);

  createMomentPost(text.trim(), null, likeSettings);
});
