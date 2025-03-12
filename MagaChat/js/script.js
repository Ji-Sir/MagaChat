// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
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
    const emojis = ['😊', '😂', '🤔', '👍', '❤️', '🎉'];
    emojiButton.addEventListener('click', function() {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        sendMessage(emoji, 'emoji');
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
});
console.log('微信克隆界面已加载完成');