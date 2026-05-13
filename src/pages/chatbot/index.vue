<template>
  <view class="chat-container">
    <view class="chat-header">
      <text class="header-title">社区智能助手</text>
    </view>
    
    <scroll-view 
      class="messages-container" 
      scroll-y="true" 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message-item"
        :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
      >
        <view class="avatar">
          <text 
            :class="message.role === 'user' ? 'user-avatar' : 'ai-avatar'"
          >
            {{ message.role === 'user' ? 'U' : 'Chatbot' }}
          </text>
        </view>
        <view class="message-content">
          <text>{{ message.content }}</text>
        </view>
      </view>
    </scroll-view>
    
    <view class="input-container">
      <input
        v-model="inputText"
        class="input-field"
        placeholder="输入您的问题..."
        @confirm="sendMessage"
        :focus="true"
      />
      <button 
        class="send-button" 
        :disabled="!inputText.trim()"
        @click="sendMessage"
      >
        发送
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const messages = ref<Message[]>([
  { role: 'assistant', content: '您好！我是社区智能助手，可以帮您解答相关问题。' }
]);
const inputText = ref('');
const scrollTop = ref(0);

const sendMessage = async () => {
  if (!inputText.value.trim()) return;

  // 添加用户消息
  const userMessage: Message = {
    role: 'user',
    content: inputText.value.trim()
  };
  messages.value.push(userMessage);
  
  // 清空输入框
  const tempInput = inputText.value;
  inputText.value = '';
  
  // 滚动到底部
  await nextTick();
  updateScrollPosition();
  
  // 模拟AI回复（实际应用中这里应该是API调用）
  setTimeout(() => {
    getAIResponse(tempInput);
  }, 500);
};

const getAIResponse = async (userQuestion: string) => {
  // 这里应该调用后端API查询知识库
  // 模拟返回结果
  let response = '正在查询知识库...';
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));    
    // 实际应用中应替换为真实的知识库查询
    // 随机5个预设答案，模拟不同的回复内容
    const answers = [
      `根据社区知识库的信息，关于"${userQuestion}"的问题，这是相关的答案。
      在实际应用中，这里会显示从知识库检索到的具体信息。`,
      `社区知识库显示，针对"${userQuestion}"的问题，以下是相关的解答。`,
      `根据社区知识库的数据，关于"${userQuestion}"的问题，这里是相关的回复。`,
      `查询社区知识库后，针对"${userQuestion}"的问题，这是相关的信息。`,
      `社区知识库提供了以下关于"${userQuestion}"问题的答案。`
    ];
    response = answers[Math.floor(Math.random() * answers.length)];
    // 将用户问题高亮显示
    response = response.replace(new RegExp(userQuestion, 'g'), `**${userQuestion}**`);
  } catch (error) {
    response = '抱歉，查询知识库时出现问题，请稍后再试。';
  }
  
  // 添加AI回复
  const aiMessage: Message = {
    role: 'assistant',
    content: response,
  };
  messages.value.push(aiMessage);
  
  await nextTick();
  updateScrollPosition();
};

const updateScrollPosition = () => {
  // 更新滚动位置到最底部
  setTimeout(() => {
    scrollTop.value = 9999;
  }, 100);
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  background-color: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.messages-container {
  flex: 1;
  padding: 20rpx;
  background-color: #f9f9f9;
}

.message-item {
  display: flex;
  margin-bottom: 30rpx;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.user-message .message-content {
  background-color: #007aff;
  color: white;
  border-radius: 20rpx 8rpx 20rpx 20rpx;
  margin-right: 20rpx;
}

.ai-message .message-content {
  background-color: white;
  border-radius: 8rpx 20rpx 20rpx 20rpx;
  margin-left: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.user-avatar {
  background-color: #007aff;
  color: white;
}

.ai-avatar {
  background-color: #4cd964;
  color: white;
}

.message-content {
  max-width: 70%;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.5;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.input-container {
  display: flex;
  padding: 20rpx;
  background-color: white;
  border-top: 1rpx solid #eee;
}

.input-field {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.send-button {
  margin-left: 20rpx;
  width: 120rpx;
  height: 80rpx;
  background-color: #007aff;
  color: white;
  border-radius: 40rpx;
  border: none;
  font-size: 28rpx;
}

.send-button:disabled {
  background-color: #ccc;
}
</style>