<template>
  <div class="ebook">
    <!-- 头部按钮集合  -->
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <div class="read-wrapper">
      <!-- #reader epubjs将书籍渲染的地方 -->
      <div id="reader"></div>
      <!-- 蒙层 实现翻页 -->
      <div class="mask">
        <!-- 上一页 -->
        <div class="left" @click="prevPage"></div>
        <!-- 显示菜单 -->
        <div class="center" @click="toggleTitleAndMenu"></div>
        <!-- 下一页 -->
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <!-- 底部菜单 -->
    <menu-bar
      :ifTitleAndMenuShow="ifTitleAndMenuShow"
      :fontSizeList="fontSizeList"
      :defaultFontSize="defaultFontSize"
      @setFontSize="setFontSize"
      :themeList="themeList"
      :defaultTheme="defaultTheme"
      @setTheme="setTheme"
      :bookAvailable="bookAvailable"
      @onProgressChange="onProgressChange"
      @jumpTo="jumpTo"
      :navigation="navigation"
      ref="menuBar"></menu-bar>
  </div>
</template>
<script>
// 引入epubjs
import Epub, { Rendition } from "epubjs";
// 公共样式
import grobal from "./assets/styles/global.scss";
// 头部菜单
import TitleBar from "./components/TitleBar.vue";
// 底部菜单
import MenuBar from "./components/MenuBar.vue";
// 获取书籍所在地址
const DOWNLOAD_URL = "/douluodalu.epub";
grobal.ePub = Epub;
export default {
  data() {
    return {
      // 头部和底部显示默认为false
      ifTitleAndMenuShow: false,
      // 字号设置集合
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 },
      ],
      // 默认字号
      defaultFontSize: 16,
      // 主题样式列表
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              'color': '#000',
              'background': '#fff'
            }
          }
        },
        {
          name: 'eye',
          style: {
            body: {
              'color': '#000',
              'background': '#ceeaba'
            }
          }
        },
        {
          name: 'night',
          style: {
            body: {
              'color': '#fff',
              'background': '#000'
            }
          }
        },
        {
          name: 'gold',
          style: {
            body: {
              'color': '#000',
              'background': 'rgb(241,236,226)'
            }
          }
        }
      ],
      // 默认主题为themeList[0]
      defaultTheme: 0,
      // bookAvailable表示图书是否处于可用状态 默认为false
      bookAvailable: false,
      navigation: null
    };
  },
  components: {
    TitleBar,
    MenuBar,
  },
  methods: {
    // 目录跳转制定页面方法
    jumpTo(href){
      this.rendition.display(href);
      this.hideTitleAndMenu()
    },
    // 隐藏标题栏和菜单栏
    hideTitleAndMenu(){
      // 隐藏标题栏和菜单栏
      this.ifTitleAndMenuShow = false;
      // 隐藏菜单栏弹出的设置栏
      this.$refs.menuBar.hideSetting();
      // 隐藏目录
      this.$refs.menuBar.hideContent();
    },
    // 设置字体大小
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize;
      if (this.themes) {
        // themes对象设置字体大小
        this.themes.fontSize(fontSize);
      }
    },
    prevPage() {
      // Rendition.prev 上一页
      //先判断rendition是否存在
      if (this.rendition) {
        // 存在
        this.rendition.prev();
      }
    },
    nextPage() {
      // Rendition.next 下一页
      //先判断rendition是否存在
      if (this.rendition) {
        // 存在
        this.rendition.next();
      }
    },
    // 点击蒙板中间区域切换标题栏和导航栏的显示
    toggleTitleAndMenu() {
      // 改变ifTitleAndMenuShow的值 取反
      this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow;
      if (!this.ifTitleAndMenuShow) {
        // 如果ifTitleAndMenuShow为false 隐藏菜单栏里的设置栏
        this.$refs.menuBar.hideSetting();
      }
    },
    // 主题设置 
    registerTheme(){
      this.themeList.forEach(theme => {
        this.themes.register(theme.name,theme.style)
      })
    },
    // 主题切换
    setTheme(index){
      this.themes.select(this.themeList[index].name)
      this.defaultTheme = index;
    },
    // progress为进度条的数值 (0~100)
    onProgressChange(progress){
      const percentage = progress / 100
      // 获取一个真实的页码 比如当前的第几页
      const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0;
      this.rendition.display(location)
    },

    // 电子书的解析和渲染
    showEpub() {
      // 生成book
      this.book = new Epub(DOWNLOAD_URL);
      // 生成Rendition,通过Book.renderTo
      // this.rendition = this.book.renderTo("read", {
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      // });
      this.rendition = this.book.renderTo("reader", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default",
      });
      // 通过Rendition.display渲染电子书
      this.rendition.display();
      // 获取Theme对象
      this.themes = this.rendition.themes;
      // 设置默认字体
      this.setFontSize(this.defaultFontSize);
      // this.themes.register(name,style)
      // this.themes.select(name)
      this.registerTheme();
      this.themes.select('night');
      this.setTheme(this.defaultTheme)
      // 获取location对象
      // 默认location对象是不会生成的 消耗性能
      // 通过epubjs的钩子函数来实现
      // this.book.ready钩子函数 表示等book解析完成之后就会进行回调的方法
      // 会返回一个promise对象
      this.book.ready.then(() => {
        this.navigation = this.book.navigation
        return this.book.locations.generate();
      }).then(result => {
        console.log('yep');
        this.locations = this.book.locations;
        this.bookAvailable = true;
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.showEpub();
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./assets/styles/global.scss";
// px2rem为global里定义的px转rem的方法
.ebook {
  position: relative;
  .read-wrapper {
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      display: flex;
      .left {
        flex: 0 0 px2rem(100);
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 px2rem(100);
      }
    }
  }
}
</style>
