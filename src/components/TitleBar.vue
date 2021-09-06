<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="ifTitleAndMenuShow">
      <div class="left">
        <span class="iconfont icon-back icon"></span>
      </div>
      <div class="right">
        <span class="iconfont icon-cart icon"></span>
        <span class="iconfont icon-person icon"></span>
        <span class="iconfont icon-MoreVertical-1 icon"></span>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/global.scss";
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: px2rem(48);
  z-index: 101;
  background: #fff;
  display: flex;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  .left {
    flex: 0 0 px2rem(60);
    @include center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    span {
      flex: 0 0 px2rem(40);
      &:nth-child(1) {
        font-size: px2rem(22);
      }
      @include center;
    }
  }
}
</style>
