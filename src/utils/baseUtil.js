export function LinkTo(nextPath, type) {
  if (this.$route.path !== nextPath) {
    if (type === "replace") {
      this.$router.replace(nextPath);
    } else {
      this.$router.push(nextPath);
    }
  }
}

export function refeshTo(nextPath, type) {
  // 通过欺骗浏览器达到刷新页面的效果
  this.$router.replace("/null")
  setTimeout(() => {
    if (type === "replace") {
      this.$router.replace(nextPath);
    } else {
      this.$router.push(nextPath);
    }
  }, 500)
}
