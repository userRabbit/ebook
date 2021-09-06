<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        :class="{ 'hide-box-shadow': ifSettingShow || !ifTitleAndMenuShow }"
        v-show="ifTitleAndMenuShow"
      >
        <span class="iconfont icon-menu1 icon" @click="showSetting(3)"></span>
        <span
          class="iconfont icon-progress icon"
          @click="showSetting(2)"
        ></span>
        <span
          class="iconfont icon-brightness icon"
          @click="showSetting(1)"
        ></span>
        <span class="icon-a icon" @click="showSetting(0)">A</span>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="ifSettingShow">
        <div class="setting-font-size" v-if="showTag === 0">
          <div
            class="preView"
            :style="{ fontSize: fontSizeList[0].fontSize + 'px' }"
          >
            A
          </div>
          <div class="select">
            <div
              class="select-wrapper"
              v-for="(item, index) in fontSizeList"
              :key="index"
              @click="setFontSize(item.fontSize)"
            >
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize === item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div
            class="preView"
            :style="{
              fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px',
            }"
          >
            A
          </div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div
            class="setting-theme-item"
            v-for="(item, index) in themeList"
            :key="index"
            @click="setTheme(index)"
          >
            <div
              class="preview"
              :style="{ background: item.style.body.background }"
              :class="{ 'no-border': item.style.body.background !== '#fff' }"
            ></div>
            <div class="text" :class="{ selected: index === defaultTheme }">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <div class="progress-wrapper">
            <!-- step表示移动增加的幅度 -->
            <!-- @change表示搜索的时候调用的一个事件(松手调用的事件) -->
            <!-- @input表示拖动的时候调用的事件 改变百分比 -->
            <!-- :disabled 什么时候不可用 -->
            <input
              type="range"
              class="progress"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress"
            />
          </div>
          <div class="text-wrapper">
            <span>{{ bookAvailable ? progress + "%" : "加载中...." }}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view :ifShowContent="ifShowContent"
                    v-show="ifShowContent"
                    :navigation="navigation"
                    :bookAvailable="bookAvailable"
                    @jumpTo="jumpTo"></content-view>
    <transition name="fade">
      <div
        class="content-mask"
        v-show="ifShowContent"
        @click="hideContent"
      ></div>
    </transition>
  </div>
</template>
<script>
import ContentView from "./Content.vue";
export default {
  components: {
    ContentView,
  },
  data() {
    return {
      ifSettingShow: false,
      showTag: 0,
      progress: 0,
      ifShowContent: false,
    };
  },
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false,
    },
    fontSizeList: Array,
    defaultFontSize: Number,
    themeList: Array,
    defaultTheme: Number,
    bookAvailable: {
      type: Boolean,
      default: false,
    },
    navigation: Object
  },
  methods: {
    //   隐藏content-view组件
    hideContent() {
      this.ifShowContent = false;
    },
    // 设置进度 调用父组件方法
    onProgressChange(progress) {
      this.$emit("onProgressChange", progress);
    },
    // 设置进度条 改变样式
    onProgressInput(progress) {
      this.progress = progress;
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    // 显示设置栏
    showSetting(tag) {
      this.showTag = tag;
      if(this.showTag === 3){
          this.ifSettingShow = false;
          this.ifShowContent = true;
      }else{
          this.ifSettingShow = true;
      }
    },
    // 隐藏设置栏
    hideSetting() {
      this.ifSettingShow = false;
    },
    // 设置fontsize 调用父组件的setFontSize方法
    setFontSize(fontSize) {
      this.$emit("setFontSize", fontSize);
    },
    // 设置主题样式 调用父组件的主题设置方法
    setTheme(index) {
      this.$emit("setTheme", index);
    },
    // 点击目录跳转页面 调用父组件的方法
    jumpTo(target){
        this.$emit('jumpTo',target)
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/global.scss";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 101;
    background: #fff;
    display: flex;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    &.hide-box-shadow {
      box-shadow: none;
    }
    span {
      flex: 1;
      &:nth-child(2) {
        font-size: px2rem(24);
      }
      &:nth-child(3) {
        font-size: px2rem(24);
      }
      @include center;
    }
  }
  .setting-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(48);
    z-index: 101;
    width: 100%;
    height: px2rem(60);
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-font-size {
      display: flex;
      height: 100%;
      .preView {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        flex: 1;
        display: flex;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            position: relative;
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: #fff;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: #000;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-theme {
      height: 100%;
      display: flex;

      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(5);
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: px2rem(1) solid #ccc;
          box-sizing: border-box;
          &.no-border {
            border: none;
          }
        }
        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          color: #ccc;
          &.selected {
            color: #333;
          }
          @include center;
        }
      }
    }
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .progress-wrapper {
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 0 px2rem(30);
        @include center;
        box-sizing: border-box;
        flex-direction: column;
        .progress {
          width: 100%;
          // 覆盖默认样式
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        flex: 1;
        font-size: px2rem(14);
        @include center;
      }
    }
  }
  .content-mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
  }
}
</style>
