<template>
  <div class="page-view">
    <van-nav-bar
      :title="title"
      :left-text="showBack ? '返回' : ''"
      :left-arrow="showBack"
      @click-left="onClickLeft"
      :fixed="true"
      :placeholder="true"
    />
    
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <!-- 下拉刷新提示 -->
        <div class="pulldown-wrapper">
          <div v-if="isPullingDown" class="loading">
            <div class="loading-spinner"></div>
            <span>正在刷新...</span>
          </div>
        </div>
        
        <!-- 内容插槽 -->
        <slot></slot>
        
        <!-- 上拉加载提示 -->
        <div class="pullup-wrapper">
          <template v-if="isPullingUp">
            <div class="loading">
              <div class="loading-spinner"></div>
              <span>加载中...</span>
            </div>
          </template>
          <template v-else>
            <span v-show="noMore" class="no-more">没有更多了</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BScroll from 'better-scroll'
import { NavBar } from 'vant'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  noMore: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const emits = defineEmits(['pulling-down', 'pulling-up'])

const wrapper = ref(null)
const scroll = ref(null)
const isPullingDown = ref(false)
const isPullingUp = ref(false)

const onClickLeft = () => {
  router.back()
}

onMounted(async () => {
  await nextTick()
  scroll.value = new BScroll(wrapper.value, {
    click: true,
    scrollY: true,
    probeType: 3,
    pullDownRefresh: {
      threshold: 50,
      stop: 30
    },
    pullUpLoad: {
      threshold: 50
    }
  })

  // 监听下拉刷新
  scroll.value.on('pullingDown', async () => {
    isPullingDown.value = true
    emits('pulling-down')
  })

  // 监听上拉加载
  scroll.value.on('pullingUp', async () => {
    if (props.noMore) return
    isPullingUp.value = true
    emits('pulling-up')
  })
})

onBeforeUnmount(() => {
  scroll.value?.destroy()
})

// 暴露方法给父组件使用
defineExpose({
  refresh: () => scroll.value?.refresh(),
  finishPullDown: () => {
    scroll.value?.finishPullDown()
    isPullingDown.value = false
  },
  finishPullUp: () => {
    scroll.value?.finishPullUp()
    isPullingUp.value = false
  }
})
</script>

<style scoped>
.page-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.wrapper {
  flex: 1;
  overflow: hidden;
}

.content {
  position: relative;
}

.pulldown-wrapper,
.pullup-wrapper {
  padding: 10px;
  text-align: center;
  color: #999;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e5e5;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.no-more {
  color: #999;
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 