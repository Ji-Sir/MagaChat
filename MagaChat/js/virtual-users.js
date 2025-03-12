// 虚拟用户管理模块
class VirtualUserManager {
    constructor() {
        this.users = this.loadUsers();
        this.defaultAvatars = [
            'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg',
            'avatar4.jpg', 'avatar5.jpg', 'avatar6.jpg', 'avatar7.jpg'
        ];
        this.nameAdjectives = ['快乐的', '可爱的', '聪明的', '温柔的', '活泼的', '优雅的', '帅气的'];
        this.nameNouns = ['小猫', '小狗', '小兔', '小熊', '小鸟', '小鱼', '小象'];
    }

    // 从 localStorage 加载用户数据
    loadUsers() {
        const savedUsers = localStorage.getItem('virtualUsers');
        return savedUsers ? JSON.parse(savedUsers) : [];
    }

    // 保存用户数据到 localStorage
    saveUsers() {
        localStorage.setItem('virtualUsers', JSON.stringify(this.users));
    }

    // 生成随机用户名
    generateRandomName() {
        const adjective = this.nameAdjectives[Math.floor(Math.random() * this.nameAdjectives.length)];
        const noun = this.nameNouns[Math.floor(Math.random() * this.nameNouns.length)];
        return adjective + noun;
    }

    // 添加新用户
    addUser(name = null, avatarIndex = null) {
        const user = {
            id: 'user_' + Date.now(),
            name: name || this.generateRandomName(),
            avatar: this.defaultAvatars[avatarIndex || Math.floor(Math.random() * this.defaultAvatars.length)],
            isActive: true
        };
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    // 删除用户
    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
        this.saveUsers();
    }

    // 更新用户状态
    updateUserStatus(userId, isActive) {
        const user = this.users.find(user => user.id === userId);
        if (user) {
            user.isActive = isActive;
            this.saveUsers();
        }
    }

    // 获取随机活跃用户
    getRandomActiveUsers(count) {
        const activeUsers = this.users.filter(user => user.isActive);
        const shuffled = activeUsers.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // 获取所有用户
    getAllUsers() {
        return this.users;
    }

    // 获取活跃用户数量
    getActiveUserCount() {
        return this.users.filter(user => user.isActive).length;
    }
}

// 导出虚拟用户管理器实例
const virtualUserManager = new VirtualUserManager();
export default virtualUserManager;