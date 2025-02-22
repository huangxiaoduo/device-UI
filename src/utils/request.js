//基于Axios库封装网络请求方法，实现取消之前的重复请求逻辑
//参考链接：https://juejin.cn/post/6968630178163458084

import { showLoadingToast, closeToast, showToast } from "vant"

const pendingMap = new Map();

const request = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  timeout: 30 * 1000
})

request.defaults.loading = true //是否显示等待loading
request.defaults.show_error_message = true // 是否需要提示错误信息
request.defaults.use_token = true // 是否需要使用token
request.defaults.cancel_repeat_request = true //是否需要取消重复请求

//请求拦截
request.interceptors.request.use(
  config => {
    removePending(config) //先判断是否存在重复的请求
    addPending(config) // 保存当前的请求

    //如果需要开启loading
    config.loading && showLoading()

    //如果需要token
    if (config.use_token) {
      config.headers['Authorization'] = window.localStorage.getItem('token')
    }

    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
request.interceptors.response.use(
  response => {
    removePending(response.config)
    response.config.loading && closeLoading(response)

    const res = response.data;   
    // 接口成功了，但是返回数据内容code不是1000，也走异常流程
    // 1001 表示空数据
    if (res.code != '1000' && res.code != '1001' && res.status != '1000' && res.status != '1001') {
      if (response.config.show_error_message) {
        showToast(res.msg)
      }
      return Promise.reject(res)
    }

    return res.data;
  },
  error => {
    error.config && removePending(error.config)
    error.config.loading && closeLoading(error)

    if (error.config.show_error_message) {
      showToast(error.msg)
    }
    return Promise.reject(error)
  }
)

export default request;


/**
 * @description: 显示loading,很多网上教程通过新建对象来计算loading数量，直接使用pendingMap来计算简化代码
 * @param {*} config
 * @return {*}
 */
function showLoading() {
  // 如果需要显示loading，并且
  if (pendingMap.size === 1) showLoadingToast({ duration: 0, forbidClick: true })
}

/**
 * @description: 关闭Loading层实例 
 * @param {*} config
 * @return {*}
 */
function closeLoading(config) {
  if (pendingMap.size === 0) {
    console.log('is cancel request: ', axios.isCancel(config));
    if (!axios.isCancel(config)) {
      closeToast();
    }
  }
}

/**
 * @description: 存储每个请求的唯一cancel回调，以此为标识
 * @param {*} config
 * @return {*}
 */
function addPending(config) {
  const pendingKey = getPendingKey(config)
  const controller = new AbortController();
  config.signal = controller.signal;
  if (!pendingMap.has(pendingKey)) {
    // 如果当前请求不在等待中，将其添加到队列中
    pendingMap.set(pendingKey, controller)
  }
}

/**
 * @description: 删除重复的请求
 * @param {*} config
 * @return {*}
 */
function removePending(config) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey) && config.cancel_repeat_request) {
    //如果当前请求在等待中，取消它并将其从等待中移除
    const controller = pendingMap.get(pendingKey)
    if (controller) controller.abort(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

/**
 * @description: 为每个请求生成唯一的key
 * @param {*} config
 * @return {*}
 */
function getPendingKey(config) {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data) //response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}