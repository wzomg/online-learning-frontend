<template>
  <div class="user-card-cmp">
    <div class="header">
      <div class="user-card-avatar">
        <el-avatar :size="50" :src="userDetails.avatar" @error="()=>true">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>
      </div>
      <div class="user-card-info">
        <p class="info-item-nickname ellipsis">{{userDetails.username}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userDetails"],
}
</script>

<style lang="scss">
.user-card-cmp {
  .header {
    display: flex;
    align-items: center;
    .user-card-info {
      width: 144px;
      margin-left: 10px;
      .info-item-nickname {
        margin: 0;
      }
      .info-item-signature {
        margin: 3px 0;
      }
    }
  }
}
</style>

