<template>
  <view class="resource-container">
    <view class="filter-bar">
      <view class="filter-item" @click="showTypePicker = true">
        <text>{{ selectedType || '资源类型' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="showSortPicker = true">
        <text>{{ selectedSort || '排序方式' }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <view class="search-bar">
      <input
        type="text"
        placeholder="搜索模型、脚本、配置模板..."
        class="search-input"
        :value="searchKeyword"
        @input="onSearch"
      />
    </view>

    <view class="resources-grid">
      <view
        v-for="(resource, index) in resources"
        :key="resource.id"
        class="resource-card"
        @click="goToResourceDetail(resource.id)"
      >
        <view class="resource-icon">
          <text class="icon">{{ getResourceIcon(resource.type) }}</text>
        </view>
        <view class="resource-info">
          <text class="title">{{ resource.title }}</text>
          <text class="desc">{{ resource.description }}</text>
          <view class="tags">
            <text
              v-for="(tag, tagIndex) in resource.tags"
              :key="tagIndex"
              class="tag"
            >
              {{ tag }}
            </text>
          </view>
          <view class="meta">
            <text class="author">{{ resource.author }}</text>
            <text class="date">{{ resource.date }}</text>
            <text class="downloads">⬇ {{ resource.downloadCount }}</text>
          </view>
        </view>
        <view class="download-btn" @click.stop="downloadResource(resource.id)">
          下载
        </view>
      </view>
    </view>

    <view v-if="hasMore" class="load-more" @click="loadMore">
      <text>加载更多</text>
    </view>
    <view v-else-if="!loading" class="no-more">
      <text>没有更多内容了</text>
    </view>

    <!-- 类型选择弹窗 -->
    <view v-if="showTypePicker" class="picker-overlay" @click="showTypePicker = false">
      <view class="picker-content" @click.stop>
        <view
          v-for="(type, index) in resourceTypes"
          :key="index"
          class="picker-option"
          @click="selectType(type)"
        >
          {{ type }}
        </view>
      </view>
    </view>

    <!-- 排序选择弹窗 -->
    <view v-if="showSortPicker" class="picker-overlay" @click="showSortPicker = false">
      <view class="picker-content" @click.stop>
        <view
          v-for="(sort, index) in sortOptions"
          :key="index"
          class="picker-option"
          @click="selectSort(sort)"
        >
          {{ sort }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '@/api';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  tags: string[];
  author: string;
  date: string;
  downloadCount: number;
}

const showTypePicker = ref(false);
const showSortPicker = ref(false);
const selectedType = ref('');
const selectedSort = ref('');
const searchKeyword = ref('');
const resources = ref<Resource[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const hasMore = computed(() => currentPage.value < totalPages.value);

const resourceTypes = ['全部', '开源源码', '模型权重', '配置模板', '一键脚本', '工具软件'];
const sortOptions = ['最新', '热门', '下载量'];

onMounted(async () => {
  await loadResources();
});

const loadResources = async () => {
  loading.value = true;
  try {
    const response = await api.resource.getResources({
      type: selectedType.value,
      search: searchKeyword.value,
      sortBy: selectedSort.value === '热门' ? 'popular' :
        selectedSort.value === '下载量' ? 'download' : 'date',
      page: currentPage.value,
      limit: 10
    });

    if (currentPage.value === 1) {
      resources.value = response.data;
    } else {
      resources.value = [...resources.value, ...response.data];
    }

    totalPages.value = Math.ceil(response.total / 10);
  } catch (error) {
    console.error('Failed to load resources:', error);
  } finally {
    loading.value = false;
  }
};

const selectType = async (type: string) => {
  selectedType.value = type;
  currentPage.value = 1;
  showTypePicker.value = false;
  await loadResources();
};

const selectSort = async (sort: string) => {
  selectedSort.value = sort;
  currentPage.value = 1;
  showSortPicker.value = false;
  await loadResources();
};

const downloadResource = async (id: number) => {
  try {
    const result = await api.resource.downloadResource(id);
    if (result) {
      uni.showToast({
        title: '开始下载',
        icon: 'success'
      });
    }
  } catch (error) {
    console.error('Download failed:', error);
    uni.showToast({
      title: '下载失败',
      icon: 'error'
    });
  }
};

const goToResourceDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/resource/detail?id=${id}`
  });
};

const onSearch = async (e: any) => {
  searchKeyword.value = e.detail.value;
  currentPage.value = 1;
  await loadResources();
};

const loadMore = async () => {
  if (!hasMore.value || loading.value) return;

  currentPage.value++;
  await loadResources();
};

const getResourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    '开源源码': '💻',
    '模型权重': '🧠',
    '配置模板': '⚙️',
    '一键脚本': '📜',
    '工具软件': '🔧',
    '资源': '📦'
  };
  return iconMap[type] || '📁';
};
</script>

<style scoped lang="scss">
.resource-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #0f172a;
}

.filter-bar {
  display: flex;
  background: #1e293b;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  border: 1rpx solid #334155;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 20rpx;
    border: 1rpx solid #334155;
    border-radius: 30rpx;
    margin: 0 10rpx;
    color: #e2e8f0;
    font-size: 26rpx;

    .arrow {
      font-size: 20rpx;
      margin-left: 10rpx;
      color: #64748b;
    }
  }
}

.search-bar {
  margin-bottom: 20rpx;

  .search-input {
    width: 100%;
    height: 60rpx;
    background: #1e293b;
    border-radius: 30rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #e2e8f0;
    border: 1rpx solid #334155;

    &::placeholder {
      color: #64748b;
    }
  }
}

.resources-grid {
  .resource-card {
    display: flex;
    background: #1e293b;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    border: 1rpx solid #334155;

    .resource-icon {
      width: 80rpx;
      height: 80rpx;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.1));
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      border: 1rpx solid #334155;

      .icon {
        font-size: 36rpx;
      }
    }

    .resource-info {
      flex: 1;

      .title {
        font-size: 30rpx;
        font-weight: bold;
        color: #e2e8f0;
        display: block;
        margin-bottom: 10rpx;
      }

      .desc {
        font-size: 24rpx;
        color: #94a3b8;
        display: block;
        margin-bottom: 15rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10rpx;

        .tag {
          font-size: 20rpx;
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          margin-right: 10rpx;
          margin-bottom: 5rpx;
          border: 1rpx solid rgba(0, 212, 255, 0.3);
        }
      }

      .meta {
        display: flex;
        justify-content: space-between;

        .author {
          font-size: 22rpx;
          color: #64748b;
        }

        .date {
          font-size: 22rpx;
          color: #64748b;
        }

        .downloads {
          font-size: 22rpx;
          color: #64748b;
        }
      }
    }

    .download-btn {
      width: 100rpx;
      height: 60rpx;
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: white;
      border-radius: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      align-self: center;
      font-weight: 500;
      box-shadow: 0 4rpx 12rpx rgba(0, 212, 255, 0.3);
    }
  }
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx;
  color: #64748b;
  font-size: 28rpx;
}

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-end;

  .picker-content {
    width: 100%;
    background: #1e293b;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    max-height: 50vh;
    overflow-y: auto;
    border-top: 1rpx solid #334155;

    .picker-option {
      padding: 30rpx 40rpx;
      border-bottom: 1rpx solid #334155;
      font-size: 30rpx;
      color: #e2e8f0;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
