document.addEventListener("DOMContentLoaded", function () {
  // --- Page Navigation ---
  const tabItems = document.querySelectorAll(".tab-item");
  const pages = document.querySelectorAll(".page");

  function setActivePage(pageId) {
    pages.forEach((page) => {
      if (page.id === pageId) {
        page.style.display = "flex"; // Or 'block' depending on your page layout needs
        page.classList.add("active-page");
      } else {
        page.style.display = "none";
        page.classList.remove("active-page");
      }
    });
  }

  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      tabItems.forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");
      const pageId = this.getAttribute("data-page");
      setActivePage(pageId);
    });
  });

  // Set initial page based on the active tab (or default to chat list)
  const initialActiveTab = document.querySelector(".tab-item.active");
  const initialPageId = initialActiveTab
    ? initialActiveTab.getAttribute("data-page")
    : "chat-list-page";
  setActivePage(initialPageId);

  // --- Chat List Navigation to Chat Detail ---
  const chatItems = document.querySelectorAll(".chat-item");
  const chatDetailPage = document.getElementById("chat-detail-page");
  const chatListPage = document.getElementById("chat-list-page");
  const chatDetailTitle = chatDetailPage.querySelector(".chat-title");
  const chatDetailBackButton = chatDetailPage.querySelector(".back-button");
  const chatDetailMessagesContainer =
    chatDetailPage.querySelector(".chat-messages");
  const chatInput = document.getElementById("chat-input-field");

  let currentChatTarget = { name: "", avatar: "" }; // Store current chat info

  chatItems.forEach((item) => {
    item.addEventListener("click", function () {
      currentChatTarget.name = this.dataset.name || "未知用户";
      currentChatTarget.avatar = this.dataset.avatar || "./images/avatar1.jpg"; // Fallback avatar

      chatDetailTitle.textContent = currentChatTarget.name;
      // TODO: Load actual chat history for this user
      loadChatHistory(currentChatTarget.name); // Placeholder
      setActivePage("chat-detail-page");
    });
  });

  // Chat Detail Back Button
  if (chatDetailBackButton) {
    chatDetailBackButton.addEventListener("click", function () {
      setActivePage("chat-list-page");
      chatInput.value = ""; // Clear input when leaving chat
      hideEmojiPanel(); // Hide emoji panel if open
    });
  }

  // --- Chat Functionality ---
  const emojiButton = chatDetailPage.querySelector(".emoji-button");
  const moreButton = chatDetailPage.querySelector(".more-button");
  const voiceButton = chatDetailPage.querySelector(".voice-button");
  const emojiPanel = chatDetailPage.querySelector(".emoji-panel");

  // Emojis - Define your list
  const emojis = [
    "😊",
    "😂",
    "🤔",
    "👍",
    "❤️",
    "🎉",
    "😄",
    "🥰",
    "😎",
    "🤗",
    "😋",
    "😇",
    "🤩",
    "😘",
    "😍",
    "😭",
    "😠",
    "😮",
    "🙄",
    "🙏",
  ];

  // Populate Emoji Panel
  function populateEmojiPanel() {
    if (!emojiPanel) return;
    emojiPanel.innerHTML = ""; // Clear existing
    emojis.forEach((emoji) => {
      const emojiSpan = document.createElement("span");
      emojiSpan.textContent = emoji;
      emojiSpan.addEventListener("click", () => {
        // Insert emoji into input field instead of sending directly
        chatInput.value += emoji;
        chatInput.focus(); // Keep focus on input
        // hideEmojiPanel(); // Optionally hide after selection
      });
      emojiPanel.appendChild(emojiSpan);
    });
  }

  function showEmojiPanel() {
    if (emojiPanel) emojiPanel.style.display = "flex";
  }

  function hideEmojiPanel() {
    if (emojiPanel) emojiPanel.style.display = "none";
  }

  function toggleEmojiPanel() {
    if (emojiPanel) {
      emojiPanel.style.display =
        emojiPanel.style.display === "none" ? "flex" : "none";
    }
  }

  if (emojiButton) {
    emojiButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click listener from firing immediately
      toggleEmojiPanel();
    });
  }

  // Hide emoji panel when clicking outside
  document.addEventListener("click", function (e) {
    if (
      emojiPanel &&
      emojiButton &&
      !emojiPanel.contains(e.target) &&
      !emojiButton.contains(e.target)
    ) {
      hideEmojiPanel();
    }
  });

  // Placeholder for loading chat history
  function loadChatHistory(userName) {
    console.log(`Loading chat history for ${userName}...`);
    // Clear previous messages
    chatDetailMessagesContainer.innerHTML = `
        <div class="message-date">2023年6月15日 星期四</div>
        <div class="message received">
            <div class="avatar"><img src="${currentChatTarget.avatar}" alt="头像"></div>
            <div class="message-content">你好，这是 ${userName} 的模拟消息。</div>
        </div>
        <div class="message sent">
            <div class="message-content">你好 ${userName}！</div>
        </div>`;
    scrollToBottom(chatDetailMessagesContainer);
  }

  // Scroll utility
  function scrollToBottom(element) {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  // Send message function
  function sendMessage(text, type = "text") {
    if (!text || text.trim() === "") return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message sent"; // Assume sending

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (type === "text" || type === "emoji") {
      // Treat emoji as text
      contentDiv.textContent = text;
    } else if (type === "image") {
      const img = document.createElement("img");
      img.src = text;
      img.style.maxWidth = "150px"; // Limit image size
      img.style.maxHeight = "150px";
      img.style.borderRadius = "4px";
      img.onload = () => scrollToBottom(chatDetailMessagesContainer); // Scroll after image loads
      contentDiv.appendChild(img);
      contentDiv.style.padding = "5px"; // Adjust padding for images
      contentDiv.style.backgroundColor = "transparent"; // No background for image container itself
    }

    messageDiv.appendChild(contentDiv);
    chatDetailMessagesContainer.appendChild(messageDiv);
    scrollToBottom(chatDetailMessagesContainer);

    // Clear input field
    chatInput.value = "";
    hideEmojiPanel(); // Hide emoji panel after sending

    // Simulate reply
    simulateReply(text);
  }

  // Simulate receiving a message
  function simulateReply(sentText) {
    setTimeout(() => {
      const replies = [
        "好的",
        "收到！",
        "嗯嗯",
        `知道了: "${sentText.substring(0, 10)}..."`,
        "😂",
        "👍",
        "让我想想...",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyDiv = document.createElement("div");
      replyDiv.className = "message received";

      const avatarDiv = document.createElement("div");
      avatarDiv.className = "avatar";
      const img = document.createElement("img");
      img.src = currentChatTarget.avatar; // Use the current chat partner's avatar
      img.alt = "头像";
      avatarDiv.appendChild(img);

      const replyContentDiv = document.createElement("div");
      replyContentDiv.className = "message-content";
      replyContentDiv.textContent = randomReply;

      replyDiv.appendChild(avatarDiv);
      replyDiv.appendChild(replyContentDiv);

      chatDetailMessagesContainer.appendChild(replyDiv);
      scrollToBottom(chatDetailMessagesContainer);
    }, 800 + Math.random() * 700); // Random delay for reply
  }

  // Send text message on Enter key press
  if (chatInput) {
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        // Send on Enter, allow Shift+Enter for newline
        e.preventDefault(); // Prevent default newline behavior
        sendMessage(this.value.trim(), "text");
      }
    });
  }

  // More button (Simulate sending image)
  if (moreButton) {
    moreButton.addEventListener("click", function () {
      // Simulate selecting and sending an image
      const images = [
        "./images/avatar1.jpg",
        "./images/avatar2.jpg",
        "./images/avatar3.jpg",
        "./images/avatar4.jpg",
      ];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      sendMessage(randomImage, "image");
      hideEmojiPanel(); // Hide emoji panel if open
    });
  }

  // Voice button (Placeholder)
  if (voiceButton) {
    voiceButton.addEventListener("click", function () {
      alert("按住说话功能正在开发中...");
      hideEmojiPanel(); // Hide emoji panel if open
    });
  }

  // --- "Me" Page Profile Updates ---
  const meProfileAvatarContainer = document.querySelector(
    "#me-page .me-profile .avatar"
  );
  const meProfileNameElement = document.getElementById("me-profile-name");

  // Load initial profile data
  function loadProfileData() {
    const savedAvatar = localStorage.getItem("userAvatar");
    const savedName = localStorage.getItem("userName");

    if (savedAvatar) {
      // Update all relevant avatar images
      document
        .querySelectorAll('img[src*="my-avatar.jpg"], #me-profile-avatar-img')
        .forEach((img) => {
          if (img) img.src = savedAvatar;
        });
    }

    if (savedName) {
      if (meProfileNameElement) meProfileNameElement.textContent = savedName;
      // Update other potential name displays if necessary (e.g., moments header)
      const momentsName = document.getElementById("moments-user-name");
      if (momentsName) momentsName.textContent = savedName;
    }
  }

  // Avatar Click Event ("Me" Page)
  if (meProfileAvatarContainer) {
    meProfileAvatarContainer.addEventListener("click", function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none"; // Hide the actual input

      fileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const newAvatarSrc = event.target.result;
            localStorage.setItem("userAvatar", newAvatarSrc);
            loadProfileData(); // Reload profile data to update images
          };
          reader.readAsDataURL(file);
        }
        document.body.removeChild(fileInput); // Clean up input element
      };

      document.body.appendChild(fileInput); // Add to body to allow click
      fileInput.click();
    });
  }

  // Username Click Event ("Me" Page)
  if (meProfileNameElement) {
    meProfileNameElement.addEventListener("click", function () {
      const currentName = this.textContent;
      const newName = prompt("请输入新的微信名称：", currentName);

      if (newName && newName.trim() !== "" && newName.trim() !== currentName) {
        const finalName = newName.trim();
        localStorage.setItem("userName", finalName);
        loadProfileData(); // Reload profile data to update names
      }
    });
  }

  // --- Initializations ---
  populateEmojiPanel();
  loadProfileData(); // Load saved avatar/name on initial script run
});
