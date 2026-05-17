<template>
  <view class="container">

    <!-- 模态框 -->
    <view v-if="modalVisible" class="modal-overlay" @click="hideModal"></view>
    
    <view v-if="modalVisible" class="modal-container">
      <view class="modal-content">
        <text class="modal-title">常用功能</text>
        
        <scroll-view class="list" scroll-y="true">
          <view v-for="item in apps" :key="item.id" class="app-item">
            <text class="app-name">{{ item.name }}</text>
            <switch 
              :value="item.inTabBar" 
              @change="toggleAppInTabBar(item.id)"
              class="tab-bar-switch"
            />
            <text class="tab-bar-label">
              {{ item.inTabBar ? '已添加到TabBar' : '添加到TabBar' }}
            </text>
          </view>
        </scroll-view>
        
        <button class="close-button" @click="hideModal">
          <text class="button-text">关闭</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface AppItem {
  id: string;
  name: string;
  icon?: string;
  inTabBar: boolean;
}

const modalVisible = ref(false);
const apps = ref<AppItem[]>([
  { id: '1', name: '设置', inTabBar: false },
  { id: '2', name: '关于', inTabBar: false },
  { id: '3', name: '帮助', inTabBar: false },
  { id: '4', name: '反馈', inTabBar: false },
  { id: '5', name: '收藏', inTabBar: false },
  { id: '6', name: '历史记录', inTabBar: false },
]);

initPage => {
  // 初始化页面数据
  showModal();
};

const showModal = () => {
  modalVisible.value = true;
};

const hideModal = () => {
  modalVisible.value = false;
};

const toggleAppInTabBar = (id: string) => {
  const appIndex = apps.value.findIndex(app => app.id === id);
  if (appIndex !== -1) {
    apps.value[appIndex].inTabBar = !apps.value[appIndex].inTabBar;
  }
};
</script>

<style scoped>
.container {
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.button {
  background-color: #007aff;
  padding: 15px;
  border-radius: 8px;
  min-width: 200px;
  align-items: center;
}

.close-button {
  margin-top: 20px;
  background-color: #aaa;
}

.button-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
}

.modal-content {
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  align-items: center;
  box-shadow: 0 -12px 16px rgba(0, 0, 0, 0.58);
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.list {
  width: 100%;
  max-height: 400px;
}

.app-item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 12px;
  padding-horizontal: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
}

.app-name {
  font-size: 16px;
  flex: 1;
}

.tab-bar-label {
  font-size: 12px;
  color: #888;
  margin-left: 10px;
}

.tab-bar-switch {
  transform: scale(0.8);
}
</style>