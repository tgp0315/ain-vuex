export const storeKey = 'store'
import { reactive } from 'vue'
import { getValue } from './utils'
export class Store {
  constructor(options) {
    console.log(options, 'options')
    // state 响应式
    this.vm = reactive(options.state)
    // getters 转换为{属性： 值}
    let getters = options.getters
    this.getters = {}
    getValue(getters, (key, value) => {
      Object.defineProperty(this.getters, item, {
        get() {
          return getters[item](this.state)
        }
      })
    })

    // actions mutations
    let mutations = options.mutations
    this.mutations = {}
    getValue(mutations, (key, value) => {
      this.mutations[key] = (data) => {
        value(this.state, data)
      }
    })

    let actions = options.actions
    this.actions = {}
    getValue(actions, (key, value) => {
      this.actions[key] = (data) => {
        value(this, data)
      }
    })
  }

  commit = (key, data) => {
    this.mutations[key](data)
  }

  dispatch = (key, data) => {
    this.actions[key](data)
  }

  get state() {
    return this.vm
  }

  install(app, key) { // 相当于vue2 中的实例  key为命名空间
    console.log(300, app)
    // 每个钻进实例都有一个$store
    app.config.globalProperties.$store = this 
    //全局提供数据 给调用组件 添加一个store实例 provide(名称：值) inject(名称)
    app.provide(key || this.storeKey, this)
  }
}