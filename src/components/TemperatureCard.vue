<template>
  <div class="w-full h-196 r-15 flex-col mid-center tempratur-change-card relative">
      <div class="flex flex-row w-full mid-between h-60 px-20">
        <!-- 减 -->
        <div @click="changeXiaoshu(-0.1)" class="w-60 h-60 mid-center">
          <img class="w-23 h-2" src="/icon/t_reduce.png" />
        </div>

        <div class="flex-col mid-center">
          <div class="flex flex-row">
            <div class="fs-60 lh-60px color-fff">{{ sliderSpliteVal[0] }}</div>
            <div class="flex flex-col ml-3 space-between">
              <div class="fs-18 mt-4 ml-2 color-fff">℃</div>
              <div class="fs-22 color-fff">.{{ sliderSpliteVal[1] || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 加 -->
        <div @click="changeXiaoshu(0.1)" class="w-60 h-60 mid-center">
          <img class="w-23 h-24" src="/icon/t_add.png" />
        </div>
      </div>

      <!-- 拖动按钮 -->
      <div class="slider absolute top-175 w-full px-20 left-0 mid-center">
        <van-slider
          class="w-full relative z-2 bg-fff opacity-0"
          ref="touchSlider"
          :min="min"
          :max="max"
          v-model="sliderVal"
          :step="setp"
          @change="sliderChangeTemperature" />
        <!-- 模拟拖动按钮图片 -->
        <img class="touch-img absolute z-1 top--2 left-0 w-75 h-45" src="/icon/touch_move.png" :style="touchImgStyle"/>

        <!-- 刻度线 -->
        <div class="absolute px-30 w-full top--27 flex flex-row space-between">
          <template v-for="(item, index) in max" :key="index">
            <!-- 根据附近值和当前值差的绝对值计算位移 -->
            <div
              v-if="item >= min"
              class="flex-col mid space-between opacity-70"
              :style="`transition: transform 100ms; transform: translateY(${
                Math.abs(item - sliderVal) <= 2 ? Math.abs(item - sliderVal) * 12 : 24
              }px)`">
              <div class="color-fff fs-12 ls-0">{{ item % 2 == 0 ? item : '' }}</div>
              <div class="w-1 h-8 bg-ffffff items-end" :class="{ 'h-6 opacity-80': item % 2 !== 0 }"></div>
            </div>
          </template>
        </div>
      </div>
  </div>
</template>

<script setup>
import { showToast } from "vant";

const props = defineProps({
  min: {
    type: Number,
    default: 16,
  },
  max: {
    type: Number,
    default: 32,
  },
  setp: {
    type: Number,
    default: 0.1,
  },
})

const sliderVal = ref(24)

const sliderSpliteVal = computed(() => String(sliderVal.value).split('.'))

// 拖动
const sliderChangeTemperature = () => {

}

const touchSlider = ref(null)
//每个小刻度的长度
const keDuItemWidth = computed(() => {
  return (touchSlider.value?.$el.clientWidth / 18).toFixed(2)
})

/**
 * @description: 小数加减
 * @param {*} step 改变的步进值
 */
const changeXiaoshu = (step) => {
  if (sliderVal.value <= 16 && step < 0) return showToast(`温度已最低`)
  if (sliderVal.value >= 32 && step > 0) return showToast(`温度已最高`)

  sliderVal.value += step
  sliderVal.value = +sliderVal.value.toFixed(1)

}

const touchImgStyle = computed(() => {
  return `transform: translateX(${(sliderVal.value - 16) * keDuItemWidth.value}px)`
})
</script>

<style scoped>
.tempratur-change-card {
  background-image: linear-gradient(90deg, #2b7bed 0%, #56b3f8 100%);
  box-shadow: 0px 6px 16px 0px rgba(40, 140, 245, 0.22);
}

.slider >>> .van-slider__button {
  top: 20px;
  right: 14px;
  width: 40px !important;
  position: relative;
  height: 40px !important;
}
</style>
