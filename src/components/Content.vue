<template>
  <transition name="slide-right">
    <div class="content">
      <div class="content-wrapper" v-if="bookAvailable">
        <div
          class="content-item"
          v-for="(item, index) in navigation.toc"
          :key="index"
          @click="jumpTo(item.href)"
        >
          <span class="text">{{ item.label }}</span>
        </div>
      </div>
      <div class="empty">加载中....</div>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
@import "../assets/styles/global.scss";

.content {
  width: 80%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  background: #fff;
  overflow: scroll;
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .content-item {
        padding-left: px2rem(20);
        border-bottom: px2rem(1) solid #ccc;
      .text {
        font-size: px2rem(16);
        white-space: nowrap;
      }
    }
  }
  .empty {
    width: 100%;
    height: 100%;
    background: #fff;
    color: #ccc;
    @include center;
    font-size: px2rem(16);
  }
}
</style>
<script>
export default {
  props: {
    ifShowContent: {
      type: Boolean,
      default: false,
    },
    navigation: Object,
    bookAvailable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    jumpTo(target) {
      this.$emit("jumpTo", target);
    },
  },
};
</script>
