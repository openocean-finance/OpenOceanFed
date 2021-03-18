<template>
  <div :class="version">
    <transition name="blur-mask__blur">
      <div v-if="visible" class="blur-mask">
        <div v-if="title" class="blur-mask__title">
          <i
            class="iconfont iconFold blur-mask__title__icon"
            @click="$emit('update:visible', false)"
          />
          <h2 class="blur-mask__title__title">{{title}}</h2>
        </div>
        <div class="blur-mask__content">
          <slot/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { lock, unlock } from 'tua-body-scroll-lock';

export default {
  name: 'BlurMask',
  props: {
    visible: { // sync
      type: Boolean,
      require: true,
    },
    scrollDomId: {
      type: String,
      require: false,
    },
    title: {
      type: String,
      require: false,
    },
  },
  beforeDestroy() {
    unlock(this.scrollDomId);
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            lock(document.getElementById(this.scrollDomId));
          });
        } else {
          unlock(document.getElementById(this.scrollDomId));
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      version: '',
    };
  },
  mounted() {
    const u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      this.version = 'android';
    }
  },
};
</script>

<style lang="scss">
.blur-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-index-mask);
  backdrop-filter: blur(50px);
  opacity: 1;
  display: flex;
  flex-direction: column;
}

.blur-mask__content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling:touch;
}

.blur-mask__blur {
  &-enter-active, &-leave-active {
    transition: all .3s;
    backdrop-filter: blur(20px);
    opacity: 1;
  }

  &-enter, &-leave-active {
    opacity: 0;
    backdrop-filter: blur(0);
  }
}
.android {
  .blur-mask {
    background-color: var(--background);
  }
}

.blur-mask__title {
  padding: var(--space-common);
  line-height: .5rem;
}

.blur-mask__title__title {
  margin: 0;
  padding: 0;
  font-size: .3rem;
  line-height: .46rem;
}

.blur-mask__title__icon {
  float: right;
  font-size: .5rem;
}
</style>
