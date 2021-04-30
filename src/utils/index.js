// 删除确认框
export function showDeleteTip(msg, callback) {
  this.$confirm(`此操作将删除该${msg}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callback()
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消删除'
    });
  });
}

// 转换时间格式
export function fromatTime(time, full = true) { //
  const y = formatNumber(time.getFullYear())
  const m = formatNumber(time.getMonth() + 1)
  const d = formatNumber(time.getDate())
  const h = formatNumber(time.getHours())
  const mm = formatNumber(time.getMinutes())
  const s = formatNumber(time.getSeconds())
  if (full) {
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
  } else {
    return `${y}-${m}-${d}`
  }
}

/**
 * 防抖函数
 * @param {Function} fn 
 * @param {Number} wait 
 */
 export function debounce(fn, wait) {
  let timer
  return function (...arg) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arg)
    },wait);
  }
}

// 判断数据类型
function isType(type) {
  return (arg) => {
    return Object.prototype.toString.call(arg) === `[object ${type}]`
  }
}

/**
 * 格式化数字 1 => 01
 * @param {Number} num 
 */
 function formatNumber(num) {
  let isNumber = isType('Number')
  if (!isNumber(num)) return
  return num >= 10 ? String(num) : '0' + String(num)
}

/**
 * 将时间转化为中文的形式：昨天 12：12，12月12日 12：12
 * @param {String | Number} date 
 */
 export const formatDateToZH = (date) => {
  const targetDate = new Date(date)
  const nowTime = new Date(formatDate(new Date())).getTime()
  const targetTime = new Date(formatDate(targetDate)).getTime()
  const daysAgo = (nowTime - targetTime) / 86400000
  const yearsAgo = new Date().getFullYear() - targetDate.getFullYear()
  const year = `${targetDate.getFullYear()}年`
  const monthAndDay = `${formatNumber(targetDate.getMonth() + 1)}月${formatNumber(targetDate.getDate())}日`
  const hourAndMinute = formatNumber(targetDate.getHours())+':'+formatNumber(targetDate.getMinutes())
  if (daysAgo < 1) {
    return hourAndMinute
  } else if (1 <= daysAgo && daysAgo < 2) {
    return `昨天 ${hourAndMinute}`
  } else if (yearsAgo < 1) {
    return monthAndDay + ' ' + hourAndMinute
  } else {
    return year + monthAndDay + ' ' + hourAndMinute
  }
}

/**
 * 格式化日期
 * @param {Date} time 
 * @param {String} type 
 */
 export function formatDate(time, type = 'YYYY-MM-DD') { //
  const y = formatNumber(time.getFullYear())
  const m = formatNumber(time.getMonth() + 1)
  const d = formatNumber(time.getDate())
  const h = formatNumber(time.getHours())
  const mm = formatNumber(time.getMinutes())
  const s = formatNumber(time.getSeconds())
  if (type === 'YYYY-MM-DD HH-MM-SS') {
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
  } else if (type === 'YYYY-MM-DD') {
    return `${y}-${m}-${d}`
  } else if (type === 'YYYY-MM') {
    return `${y}-${m}`
  } else if (type === 'HH-MM-SS') {
    return `${h}:${mm}:${s}`
  } else if (type === 'HH') {
    return `${h}`
  }
}
