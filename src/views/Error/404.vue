<template>
  <div class="err-page">
    <div class="bubbling">
      <img class="img" width="400" height="400" src="@/assets/img/404.png" alt="">
      <div class="tip">页面走丢了（╯－＿－），访问其他页面试试吧(ง •̀_•́)ง</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NotFound',
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Bubblegum+Sans&display=swap');

  .err-page {
    display: flex;
    height: calc(100vh - 112px);
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #f9fafa;

    .bubbling {
      position: relative;
      z-index: 2;
      display: inline-block;
      color: #979797;
      font-family: 'Bubblegum Sans', cursive;
      font-weight: bold;
      text-transform: uppercase;
      .img{
        margin-top: -40px
      }
      .tip{
        width: 500px;
        position: absolute;
        top: 265px;
        left: 50%;
        margin-left: -250px;
      }
    }

    .bubble {
      position: absolute;
      background: white;
      border-radius: 100%;
    }

    .back {
      margin-top: 30px;

      &:hover {
        color: #409EFF !important;
        background-color: #ecf5ff !important;
        border-color: #b3d8ff !important;
      }
    }
  }
</style>


