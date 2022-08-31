export const storeKey = 'store'
import { reactive } from 'vue'
import { getValue } from './utils'

class Module {
  constructor(rawModule) {
    this._raw = rawModule
    this._children = {}
    this.state = rawModule.state
  }

  addChild(key, module) {
    this._children[key] = module
  }

  getChild(key) {
    return this._children[key]
  }

  forEachValue(fn) {
    getValue(this._children, fn)
  }
}
class moduleCollection {
  constructor(rootModule) {
    this.root = null
    this.register(rootModule, [])
  }

  register(rawModule, path) {
    const newModule = new Module(rawModule)
    if (!path.length) { // 是一个模块
      this.root = newModule
    } else {
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rawModule.modules) {
      getValue(rawModule.modules, (key, rawChildModule) => {
        this.register(rawChildModule, path.concat(key))
      })
    }

    console.log(this.root)
  }
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length // 如果数组是空数组说明是根，否则不是
  if (!isRoot) {
    console.log(module)
    let parentState = path.slice(0, -1).reduce((stste, key) => {
      return state[key]
    }, rootState)
    parentState[path[path.length - 1]] = module.state
  }


  module.getChild((key, child) => {
    installModule(store, rootState, path.concat(key), child)
  })
}
export class Store {
  constructor(options) {
    const store = this
    this._modules = new moduleCollection(options)
    console.log(this._modules, '_modules')
    // 定义状态
    const state = store._modules.root.state // 跟状态
    installModule(store, state, [], store._modules.root)
    console.log(state)
  }

  install(app, key) { // 相当于vue2 中的实例  key为命名空间
    console.log(300, app)
    // 每个钻进实例都有一个$store
    app.config.globalProperties.$store = this
    //全局提供数据 给调用组件 添加一个store实例 provide(名称：值) inject(名称)
    app.provide(key || this.storeKey, this)
  }
}
