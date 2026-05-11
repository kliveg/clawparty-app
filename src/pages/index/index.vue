<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const slogan = ref('从零搭建智能Bot，汇聚AI开发者同好')
const description = ref(
  '垂直AI Agent开发者社区，面向本地大模型、智能Bot（Hermes/OpenClaw）搭建爱好者。提供教程、资源、社区问答、工具集服务，解决新手部署报错、资源难找问题。',
)
console.log('AI Agent社区首页加载完成')

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})
</script>

<template>
  <view class="bg-[#1a1a2e] px-4 pt-safe min-h-screen">
    <!-- Logo区域 -->
    <view class="mt-10">
      <image src="/static/logo.svg" alt="" class="mx-auto block h-28 w-28" />
    </view>

    <!-- 产品名称 -->
    <view class="mt-4 text-center text-4xl font-bold text-[#00d4ff]">
      AI Agent开发者社区
    </view>

    <!-- Slogan -->
    <view class="mb-8 mt-2 text-center text-2xl text-gray-300">
      {{ slogan }}
    </view>

    <!-- 产品介绍 -->
    <view class="m-auto mb-6 max-w-100 text-justify indent text-4 text-gray-400 leading-relaxed">
      {{ description }}
    </view>

    <!-- 核心功能标签 -->
    <view class="flex flex-wrap justify-center gap-3 mb-6">
      <view class="px-4 py-2 bg-[#16213e] rounded-full text-[#00d4ff] text-sm border border-[#00d4ff]/30">
        📚 教程中心
      </view>
      <view class="px-4 py-2 bg-[#16213e] rounded-full text-[#00d4ff] text-sm border border-[#00d4ff]/30">
        💾 资源广场
      </view>
      <view class="px-4 py-2 bg-[#16213e] rounded-full text-[#00d4ff] text-sm border border-[#00d4ff]/30">
        💬 社区圈子
      </view>
      <view class="px-4 py-2 bg-[#16213e] rounded-full text-[#00d4ff] text-sm border border-[#00d4ff]/30">
        🔧 工具集合
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="mt-8 text-center text-gray-500 text-sm">
      <view class="mb-2">
        技术支持：
        <text class="text-[#00d4ff]">
          UniApp + Vue3 + TypeScript
        </text>
      </view>
      <view class="text-xs text-gray-600">
        适配微信小程序 / H5 / 多端平台
      </view>
    </view>
  </view>
</template>
