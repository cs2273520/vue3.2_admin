const changeTime = (val) => {
  if (!isNull(val)) {
    const res = new Date(parseInt(val) * 1000)
    val = `${res.getFullYear()}-${res.getMonth() + 1}-${res.getDay()}
     ${res.getHours()}:${res.getMinutes()}:${res.getSeconds()}`
    return val
  } else {
    return '----'
  }
}

export const isNull = (date) => {
  if (!date) return true
  if (JSON.stringify(date) === '{}') return true
  if (JSON.stringify(date) === '[]') return true
  if (JSON.stringify(date) === 'null') return true
}

export default (app) => {
  app.config.globalProperties.$filters = {
    changeTime
  }
}
