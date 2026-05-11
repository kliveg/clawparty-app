<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'

onLaunch((options) => {
  console.log('App.vue onLaunch', options)
})
onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})

onShow(() => {
	console.log('App Show - 应用进入前台')
})

onHide(() => {
	console.log('App Hide - 应用进入后台')
})

onError((err) => {
	console.error('App Error - 全局错误捕获:', err)
	// 这里可以上报错误到监控平台
})
</script>

<style lang="scss">
/* uni.scss */
@import '@/uni.scss';

</style>