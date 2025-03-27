// Import the VirtualUserManager class
import VirtualUserManager from "./virtual-users.js";

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const postText = document.querySelector(".post-text");
  const imageInput = document.getElementById("imageInput");
  const addImageBtnContainer = document.querySelector(".add-image"); // Container div
  const imageGrid = document.querySelector(".image-grid");
  const postBtn = document.querySelector(".post-btn");
  const backBtn = document.querySelector(".header-back");
  const likeCountInput = document.querySelector(".like-count-input");
  const addUserBtn = document.querySelector(".add-user-btn");
  const usersList = document.querySelector(".users-list");

  // 初始化虚拟用户管理器
  const userManager = new VirtualUserManager();
  const MAX_IMAGES = 9;

  // 更新发布按钮状态
  function updatePostButtonState() {
    const hasText = postText.value.trim().length > 0;
    const hasImages = imageGrid.children.length > 0;
    postBtn.disabled = !hasText && !hasImages;
  }

  // 更新添加图片按钮的可见性
  function updateAddImageButtonVisibility() {
    addImageBtnContainer.style.display =
      imageGrid.children.length >= MAX_IMAGES ? "none" : "flex";
  }

  // 文本输入事件
  postText.addEventListener("input", updatePostButtonState);

  // 返回按钮点击事件
  backBtn.addEventListener("click", () => {
    // Consider asking for confirmation if content exists
    if (!postBtn.disabled && !confirm("您编辑的内容尚未发表，确定要离开吗？")) {
      return;
    }
    window.location.href = "moments.html";
  });

  // 图片选择事件
  imageInput.addEventListener("change", function (event) {
    const files = Array.from(event.target.files);
    const currentImageCount = imageGrid.children.length;

    files.slice(0, MAX_IMAGES - currentImageCount).forEach((file) => {
      if (!file.type.startsWith("image/")) return; // Ensure it's an image

      const reader = new FileReader();
      reader.onload = function (e) {
        const imgContainer = document.createElement("div");
        imgContainer.className = "image-item-preview";

        const img = document.createElement("img");
        img.src = e.target.result;

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-image-btn";
        deleteBtn.innerHTML = "×"; // 'x' symbol
        deleteBtn.addEventListener("click", () => {
          imgContainer.remove();
          updatePostButtonState();
          updateAddImageButtonVisibility();
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        imageGrid.appendChild(imgContainer);
        updatePostButtonState();
        updateAddImageButtonVisibility();
      };
      reader.readAsDataURL(file);
    });
    event.target.value = ""; // Clear the input for next selection
  });

  // 添加虚拟用户事件
  addUserBtn.addEventListener("click", () => {
    const user = userManager.addUser(); // Add user with random data
    renderUser(user);
  });

  // 渲染虚拟用户 (带复选框)
  function renderUser(user) {
    const userItem = document.createElement("div");
    userItem.className = "user-item";
    userItem.dataset.userId = user.id;

    userItem.innerHTML = `
      <input type="checkbox" class="user-active-checkbox" id="user-active-${
        user.id
      }" ${user.isActive ? "checked" : ""}>
      <label for="user-active-${user.id}" class="user-select-label">
          <div class="avatar">
              <img src="./images/${user.avatar}" alt="头像">
          </div>
          <div class="name">${user.name}</div>
      </label>
      <button class="delete-user-btn">×</button>
  `;

    // Update user status when checkbox changes
    userItem
      .querySelector(".user-active-checkbox")
      .addEventListener("change", (e) => {
        userManager.updateUserStatus(user.id, e.target.checked);
      });

    // Delete user button
    userItem.querySelector(".delete-user-btn").addEventListener("click", () => {
      if (confirm(`确定要删除虚拟用户 "${user.name}" 吗？`)) {
        userManager.removeUser(user.id);
        userItem.remove();
      }
    });

    usersList.appendChild(userItem);
  }

  // 初始化渲染现有虚拟用户
  function initializeUserList() {
    usersList.innerHTML = ""; // Clear previous list
    userManager.getAllUsers().forEach((user) => renderUser(user));
  }
  initializeUserList(); // Load and render users on page load

  // 发布按钮点击事件
  postBtn.addEventListener("click", () => {
    const text = postText.value.trim();
    const images = Array.from(
      imageGrid.querySelectorAll(".image-item-preview img")
    ).map((img) => img.src);
    const likeCount = parseInt(likeCountInput.value) || 0;

    // Get selected (active) virtual users from the UserManager
    const selectedVirtualUsers = userManager.getRandomActiveUsers(likeCount);

    // 创建动态数据
    const moment = {
      id:
        "moment_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9), // More unique ID
      text: text,
      images: images,
      timestamp: Date.now(),
      likes: {
        count: selectedVirtualUsers.length, // Actual count based on selected users
        users: selectedVirtualUsers, // Store selected users {id, name, avatar}
      },
      // comments: [] // Placeholder for comments if needed later
    };

    // 保存动态到本地存储
    try {
      const moments = JSON.parse(localStorage.getItem("moments") || "[]");
      moments.unshift(moment); // Add new moment to the beginning
      localStorage.setItem("moments", JSON.stringify(moments));

      // 返回朋友圈页面
      window.location.href = "moments.html";
    } catch (error) {
      console.error("Error saving moment to localStorage:", error);
      alert("保存动态失败，请稍后再试。");
    }
  });

  // Initial state updates
  updatePostButtonState();
  updateAddImageButtonVisibility();
});
