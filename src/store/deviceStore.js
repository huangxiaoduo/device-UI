export const useDeviceStore = defineStore('deviceStore', () => {
  const count = ref(0)

  function increment() {
    count.value++
  } 

  return { count, increment }
})