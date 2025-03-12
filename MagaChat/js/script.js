document.addEventListener("DOMContentLoaded", function () {
    // 底部导航切换
    const tabItems = document.querySelectorAll('.tab-item');
    const pages = document.querySelectorAll('.page');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有tab的active类
            tabItems.forEach(tab => tab.classList.remove('active'));
            // 给当前点击的tab添加active类
            this.classList.add('active');
            
            // 获取要显示的页面id
            const pageId = this.getAttribute('data-page');
            
            // 隐藏所有页面
            pages.forEach(page => page.style.display = 'none');
            
            // 显示对应页面
            document.getElementById(pageId).style.display = 'flex';
        });
    });
    
    // 聊天列表项点击事件
    const chatItems = document.querySelectorAll('.chat-item');
    const chatDetailPage = document.getElementById('chat-detail-page');
    const chatListPage = document.getElementById('chat-list-page');
    const chatTitle = document.querySelector('.chat-title');
    
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取聊天对象名称
            const name = this.querySelector('.name').textContent;
            // 设置聊天详情页标题
            chatTitle.textContent = name;
            
            // 隐藏聊天列表页，显示聊天详情页
            chatListPage.style.display = 'none';
            chatDetailPage.style.display = 'flex';
        });
    });
    
    // 返回按钮点击事件
    const backButton = document.querySelector('.back-button');
    
    backButton.addEventListener('click', function() {
        // 隐藏聊天详情页，显示聊天列表页
        chatDetailPage.style.display = 'none';
        chatListPage.style.display = 'flex';
    });
    
    // 聊天功能
    const chatInput = document.querySelector('.text-input input');
    const chatMessages = document.querySelector('.chat-messages');
    const emojiButton = document.querySelector('.emoji-button');
    const moreButton = document.querySelector('.more-button');
    const voiceButton = document.querySelector('.voice-button');
    
    // 发送消息函数
    function sendMessage(text, type = 'text') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (type === 'text') {
            contentDiv.textContent = text;
        } else if (type === 'emoji') {
            contentDiv.innerHTML = text;
        } else if (type === 'image') {
            const img = document.createElement('img');
            img.src = text;
            img.style.maxWidth = '200px';
            contentDiv.appendChild(img);
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 模拟回复
        setTimeout(() => {
            const replies = [
                '好的，我知道了！',
                '嗯嗯，继续说~',
                '这个想法不错！',
                '我明白你的意思了',
                '让我想想...',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message received';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            
            const img = document.createElement('img');
            img.src = './images/avatar1.jpg';
            img.alt = '头像';
            
            const replyContentDiv = document.createElement('div');
            replyContentDiv.className = 'message-content';
            replyContentDiv.textContent = randomReply;
            
            avatarDiv.appendChild(img);
            replyDiv.appendChild(avatarDiv);
            replyDiv.appendChild(replyContentDiv);
            
            chatMessages.appendChild(replyDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    
    // 发送文本消息
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            sendMessage(this.value.trim());
            this.value = '';
        }
    });
    
    // 表情按钮点击事件
    const emojis = ['😊', '😂', '🤔', '👍', '❤️', '🎉', '😄', '🥰', '😎', '🤗', '😋', '😇', '🤩', '😘', '😍'];
    const emojiPanel = document.createElement('div');
    emojiPanel.className = 'emoji-panel';
    emojiPanel.style.display = 'none';
    
    // 创建表情面板
    emojis.forEach(emoji => {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emoji;
        emojiSpan.addEventListener('click', () => {
            sendMessage(emoji, 'emoji');
            emojiPanel.style.display = 'none';
        });
        emojiPanel.appendChild(emojiSpan);
    });
    
    // 将表情面板添加到聊天界面
    document.querySelector('.chat-input').appendChild(emojiPanel);
    
    emojiButton.addEventListener('click', function() {
        emojiPanel.style.display = emojiPanel.style.display === 'none' ? 'flex' : 'none';
    });

    // 点击其他地方关闭表情面板
    document.addEventListener('click', function(e) {
        if (!emojiPanel.contains(e.target) && !emojiButton.contains(e.target)) {
            emojiPanel.style.display = 'none';
        }
    });
    
    // 更多功能按钮点击事件（模拟发送图片）
    moreButton.addEventListener('click', function() {
        // 模拟选择图片
        const images = [
            './images/avatar1.jpg',
            './images/avatar2.jpg',
            './images/avatar3.jpg'
        ];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        sendMessage(randomImage, 'image');
    });
    
    // 语音按钮点击事件
    voiceButton.addEventListener('click', function() {
        alert('按住说话功能正在开发中...');
    });
    
    // 更新所有 my-avatar 图片
    const myAvatars = document.querySelectorAll('img[src*="my-avatar.jpg"]');
    myAvatars.forEach(img => {
        img.src = `${img.src}?v=${new Date().getTime()}`;
    });
    
    // 获取"我"页面的头像和用户名元素
    const meProfileAvatar = document.querySelector("#me-page .me-profile .avatar");
    const meProfileName = document.querySelector("#me-page .profile-info .name");
    
    // 头像点击事件
    if (meProfileAvatar) {
        meProfileAvatar.addEventListener("click", function() {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.display = "none";
            document.body.appendChild(fileInput);

            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // 更新所有使用 my-avatar.jpg 的图片
                        const allMyAvatars = document.querySelectorAll('img[src*="my-avatar.jpg"]');
                        allMyAvatars.forEach(img => {
                            img.src = e.target.result;
                        });
                        
                        // 存储到 localStorage 中
                        localStorage.setItem('userAvatar', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                document.body.removeChild(fileInput);
            };
            
            fileInput.click();
        });
    }

    // 用户名点击事件
    if (meProfileName) {
        meProfileName.addEventListener("click", function() {
            const currentName = this.textContent;
            const newName = prompt("请输入新的微信名称：", currentName);
            
            if (newName && newName.trim() !== "") {
                // 更新显示的名称
                this.textContent = newName.trim();
                
                // 存储到 localStorage 中
                localStorage.setItem('userName', newName.trim());
                
                // 更新所有显示用户名的地方
                const allUserNames = document.querySelectorAll('.name:not(.contact-item .name)');
                allUserNames.forEach(nameElement => {
                    nameElement.textContent = newName.trim();
                });
            }
        });
    }

    // 页面加载时恢复保存的头像和用户名
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedName = localStorage.getItem('userName');

    if (savedAvatar) {
        const allMyAvatars = document.querySelectorAll('img[src*="my-avatar.jpg"]');
        allMyAvatars.forEach(img => {
            img.src = savedAvatar;
        });
    }

    if (savedName) {
        const allUserNames = document.querySelectorAll('.name:not(.contact-item .name)');
        allUserNames.forEach(nameElement => {
            nameElement.textContent = savedName;
        });
    }
});