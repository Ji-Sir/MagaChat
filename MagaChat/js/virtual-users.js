// 虚拟用户管理模块
class VirtualUserManager {
  constructor() {
    this.storageKey = "virtualUsers_v1"; // Key for localStorage
    this.users = this._loadUsers();
    this.defaultAvatars = [
      "avatar1.jpg",
      "avatar2.jpg",
      "avatar3.jpg",
      "avatar4.jpg",
      "avatar5.jpg",
      "avatar6.jpg",
      "avatar7.jpg",
    ];
    // Expanded names for more variety
    this.namePrefixes = [
      "快乐的",
      "可爱的",
      "聪明的",
      "温柔的",
      "活泼的",
      "优雅的",
      "帅气的",
      "神秘的",
      "勇敢的",
      "安静的",
    ];
    this.nameSuffixes = [
      "小猫",
      "小狗",
      "兔子",
      "熊猫",
      "海豚",
      "小鸟",
      "狐狸",
      "松鼠",
      "考拉",
      "小象",
    ];
  }

  // 从 localStorage 加载用户数据 (Private helper)
  _loadUsers() {
    try {
      const savedUsers = localStorage.getItem(this.storageKey);
      return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (error) {
      console.error("Error loading virtual users from localStorage:", error);
      return []; // Return empty array on error
    }
  }

  // 保存用户数据到 localStorage (Private helper)
  _saveUsers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    } catch (error) {
      console.error("Error saving virtual users to localStorage:", error);
    }
  }

  // 生成随机用户名
  _generateRandomName() {
    const prefix =
      this.namePrefixes[Math.floor(Math.random() * this.namePrefixes.length)];
    const suffix =
      this.nameSuffixes[Math.floor(Math.random() * this.nameSuffixes.length)];
    // Avoid duplicate names if possible (simple check)
    let potentialName = prefix + suffix;
    let attempts = 0;
    while (
      this.users.some((user) => user.name === potentialName) &&
      attempts < 10
    ) {
      potentialName = prefix + suffix + (attempts > 0 ? attempts + 1 : "");
      attempts++;
    }
    return potentialName;
  }

  // 添加新用户
  addUser() {
    const newUser = {
      id: "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5), // More unique ID
      name: this._generateRandomName(),
      avatar:
        this.defaultAvatars[
          Math.floor(Math.random() * this.defaultAvatars.length)
        ],
      isActive: true, // Default to active
    };
    this.users.push(newUser);
    this._saveUsers();
    console.log("Added virtual user:", newUser);
    return newUser;
  }

  // 删除用户
  removeUser(userId) {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    if (this.users.length < initialLength) {
      this._saveUsers();
      console.log("Removed virtual user:", userId);
      return true;
    }
    return false;
  }

  // 更新用户状态 (isActive)
  updateUserStatus(userId, isActive) {
    const user = this.users.find((user) => user.id === userId);
    if (user) {
      user.isActive = !!isActive; // Ensure boolean
      this._saveUsers();
      console.log("Updated virtual user status:", userId, user.isActive);
      return true;
    }
    return false;
  }

  // 获取指定数量的随机【活跃】用户
  getRandomActiveUsers(count) {
    const activeUsers = this.users.filter((user) => user.isActive);
    // Shuffle the active users array (Fisher-Yates shuffle)
    for (let i = activeUsers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeUsers[i], activeUsers[j]] = [activeUsers[j], activeUsers[i]];
    }
    // Return the requested number of users, or all active users if count is larger
    return activeUsers.slice(0, Math.min(count, activeUsers.length));
  }

  // 获取所有用户
  getAllUsers() {
    return [...this.users]; // Return a copy to prevent direct modification
  }

  // 获取活跃用户数量
  getActiveUserCount() {
    return this.users.filter((user) => user.isActive).length;
  }
}

// Export the class itself, not an instance, following standard practice.
export default VirtualUserManager;
