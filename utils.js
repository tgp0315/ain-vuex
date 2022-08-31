export function getValue(obj, cb) {
  Object.keys(obj).forEach(item => {
    cb(item, obj[item])
  })
}

