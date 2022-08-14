import { inject } from 'vue'
import { storeKey, Store } from './store'


export function createStore(options) { // 创建一个store
  return new Store(options)
}

export function useStore(key = null) {
  return inject(key || storeKey)
} 