<template>
  <!-- 模式 风速 -->
  <div class="bg-fff px-10 py-20 radius-8">
    <!-- 模式 -->
    <!-- <div class="flex space-between">
      <AppToggleButton v-for="name in modeCtrlGroup" isRound :key="name" :btnName="name" />
    </div> -->

    <!-- 滑动风速 -->
    <div class="mt-28 relative">
      <div class="relative">
        <div class="absolute px-10 top-0 w-full h-full flex space-between mid">
          <template v-for="item in windArray" :key="item.iconName">
            <div class="dot" :style="`background-color: ${item.isActive ? '#1989fa' : '#e5e5e5'}`"></div>
          </template>
        </div>
        <div class="px-10">
          <van-slider v-model="windValue" bar-height="4px" :min="1" :max="100" active-color="#1989fa" inactive-color="#e5e5e5">
            <template #button>
              <div class="custom-button">{{ windValue }}</div>
            </template>
          </van-slider>
        </div>
      </div>

      <!-- 风速名称 -->
      <div class="w-full mt-22 flex space-between">
        <template v-for="(item, index) in windArray" :key="item.iconName">
          <div class="fs-12 w-40 t-c" :class="windSliderIndex == index ? 'active color-2B7BED' : 'color-999999'">
            {{ item.title }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const windValue = ref(50)
const windArray = ref([
  { title: "自动风", iconName: "wind_auto", isActive: windValue.value > 0 },
  { title: "微风", iconName: "wind_gentlebreeze", isActive: windValue.value > 20 },
  { title: "低风", iconName: "wind_low", isActive: windValue.value > 40 },
  { title: "中风", iconName: "wind_middle", isActive: windValue.value > 60 },
  { title: "高风", iconName: "wind_high", isActive: windValue.value > 80 },
  { title: "强劲风", iconName: "wind_strong", isActive: windValue.value === 100 }
])
const clickWind = (wind) => {
  console.log('--', wind);
}
</script>

<style scoped>
.custom-button {
  width: 25px;
  line-height: 25px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background-color: #1989fa;
  border-radius: 100px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>