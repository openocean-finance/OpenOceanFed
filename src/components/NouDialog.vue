<template>
  <transition name="fadeBack" @after-leave="handleLeave">
    <div v-show="isShow" class="nou-dialog nou-g-box" @click="handleClickModal">
      <div class="nou-dialog__container__wrapper">
        <transition name="fade">
          <div
            v-show="isShow"
            class="nou-dialog__container"
            :class="{...dialogClass, 'fixed-mobile':fixedMobile}"
            @click.stop
          >
            <slot name="close">
              <i
                v-if="showClose"
                class="iconfont iconClean nou-dialog__close nou-g-btn--hover"
                @click="close"
              />
            </slot>
            <h2 v-if="title.length > 0" class="nou-dialog__title nou-g-font-mid">{{ title }}</h2>
            <slot v-if="contentActive"/>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>
<script>
import { lock, unlock } from 'tua-body-scroll-lock';

/**
 * dialog
 * @date 2019-12-23
 * @desc
 */
export default {
  name: 'NouDialog',
  props: {
    visible: {
      type: Boolean,
      require: false,
      default: true,
    },
    keepSlot: { // keep slot instead of recreated
      type: Boolean,
      require: false,
      default: false,
    },
    title: {
      type: String,
      require: true,
      default: '',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    dialogClass: {
      type: Object,
      require: false,
      default: () => {
      },
    },
    showClose: {
      type: Boolean,
      require: false,
      default: false,
    },
    fixedMobile: { // fixed bottom when mobile
      type: Boolean,
      require: false,
      default: false,
    },
    scrollDomID: {
      type: String,
      require: false,
      default: 'js-dialog-scroll-dom',
    },
  },
  data() {
    return {
      isShow: false,
      contentActive: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.show();
      } else {
        this.close();
      }
    },
  },
  beforeDestroy() {
    this.unlockScroll();
  },
  created() {
    if (this.keepSlot) {
      this.contentActive = true;
    }
  },
  methods: {
    unlockScroll() {
      const dom = document.getElementById(this.scrollDomID);
      if (dom) {
        unlock(dom); // unlock when destroy custom
      } else {
        unlock();
      }
    },
    lockScroll() {
      const dom = document.getElementById(this.scrollDomID);
      if (dom) {
        lock(dom); // unlock when destroy custom
      } else {
        lock();
      }
    },
    close() { // public
      this.unlockScroll();
      this.isShow = false;
      this.$emit('update:visible', false);
    },
    handleClickModal() {
      if (this.closeOnClickModal) {
        this.close();
      }
    },
    show() {
      this.isShow = true;
      this.contentActive = true;
      this.$nextTick(() => {
        this.lockScroll();
      });
    },
    handleLeave() {
      if (!this.keepSlot) { // destroy slot after leave
        this.contentActive = false; // avoid view change between transition
      }
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
$g-screen-flag: 750px;

.nou-dialog {
  z-index: 999999999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--dialog-mask);
  cursor: initial;
  overflow: auto;
}

.nou-dialog__container__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.nou-dialog__container {
  position: relative;
  margin: 100px 0;
  width: 360px; // 400 total
  max-width: 100%;
  padding: 20px;
  border-radius: 10px;
  background: var(--dialog-content);
  text-align: left;

  @media (max-width: $g-screen-flag) {
    margin: 1rem 0;
    box-sizing: border-box;
    width: calc(100% - .6rem);
    padding: .4rem;

    &.fixed-mobile {
      position: fixed;
      top: initial;
      bottom: 0;
      left: 50%;
      margin: 0;
      transform: translate3d(-50%, 0, 0);
    }
  }
}

.nou-dialog__close {
  float: right;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
  @media (max-width: $g-screen-flag) {
    font-size: .28rem;
    margin-top: .07rem;
  }
}

.nou-dialog__title {
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  font-family: Poppins-SemiBold, Poppins, serif;

  @media (max-width: $g-screen-flag) {
    font-size: .36rem;
    line-height: .42rem;
    padding-bottom: .4rem;
  }
}

.fade-enter-active, .fade-leave-active {
  //transition: all .5s;
  //transform: translateZ(0);
}

.fade-enter, .fade-leave-active {
  //opacity: 0;
  //transform: translate3d(0, 100%, 0);
}

.fadeBack-enter-active, .fadeBack-leave-active {
  transition: opacity .5s;
  opacity: 1;
}

.fadeBack-enter, .fadeBack-leave-active {
  opacity: 0;
}

</style>
