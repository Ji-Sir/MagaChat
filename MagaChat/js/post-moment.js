// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const postText = document.querySelector(".post-text");
  const imageInput = document.getElementById("imageInput");
  const addImageBtn = document.querySelector(".add-image");
  const imageGrid = document.querySelector(".image-grid");
  const postBtn = document.querySelector(".post-btn");
  const backBtn = document.querySelector(".header-back");
  const likeCountInput = document.querySelector(".like-count-input");
  const addUserBtn = document.querySelector(".add-user-btn");
  const usersList = document.querySelector(".users-list");

  // 初始化虚拟用户管理器
  const userManager = new VirtualUserManager();

  // 更新发布按钮状态
  function updatePostButtonState() {
    const hasText = postText.value.trim().length > 0;
    const hasImages = imageGrid.children.length > 0;
    postBtn.disabled = !hasText && !hasImages;
  }

  // 文本输入事件
  postText.addEventListener("input", updatePostButtonState);

  // 返回按钮点击事件
  backBtn.addEventListener("click", () => {
    window.location.href = "moments.html";
  });

  // 添加图片按钮点击事件
  addImageBtn.addEventListener("click", () => {
    if (imageGrid.children.length >= 9) {
      alert("最多只能上传9张图片");
      return;
    }
    imageInput.click();
  });

  // 图片选择事件
  imageInput.addEventListener("change", function () {
    const files = Array.from(this.files);
    files.forEach((file) => {
      if (imageGrid.children.length >= 9) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.addEventListener("click", () => {
          if (confirm("是否删除这张图片？")) {
            img.remove();
            updatePostButtonState();
          }
        });
        imageGrid.appendChild(img);
        updatePostButtonState();
      };
      reader.readAsDataURL(file);
    });
    this.value = "";
  });

  // 添加虚拟用户事件
  addUserBtn.addEventListener("click", () => {
    const user = userManager.addUser();
    renderUser(user);
  });

  // 渲染虚拟用户
  function renderUser(user) {
    const userItem = document.createElement("div");
    userItem.className = "user-item";
    userItem.innerHTML = `
            <div class="avatar">
                <img src="./images/${user.avatar}" alt="头像">
            </div>
            <div class="name">${user.name}</div>
            <div class="delete-btn">×</div>
        `;

    userItem.querySelector(".delete-btn").addEventListener("click", () => {
      userManager.removeUser(user.id);
      userItem.remove();
    });

    usersList.appendChild(userItem);
  }

  // 初始化渲染现有虚拟用户
  userManager.users.forEach((user) => renderUser(user));

  // 发布按钮点击事件
  postBtn.addEventListener("click", () => {
    const text = postText.value.trim();
    const images = Array.from(imageGrid.children).map((img) => img.src);
    const likeCount = parseInt(likeCountInput.value) || 0;
    const activeUsers = userManager.users.filter((user) => user.isActive);

    // 创建动态数据
    const moment = {
      id: "moment_" + Date.now(),
      text: text,
      images: images,
      timestamp: Date.now(),
      likes: {
        count: likeCount,
        users: activeUsers.slice(0, likeCount),
      },
    };

    // 保存动态到本地存储
    const moments = JSON.parse(localStorage.getItem("moments") || "[]");
    moments.unshift(moment);
    localStorage.setItem("moments", JSON.stringify(moments));

    // 返回朋友圈页面
    window.location.href = "moments.html";
  });
});
