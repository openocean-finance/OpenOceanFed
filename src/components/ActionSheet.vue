<template>
  <transition name="action-sheet-fade">
    <div v-show="isShowing" class="action-sheet" @click="modalClickHandler">
      <transition name="action-sheet-up">
        <div v-if="isShowing" ref="scrollDom" class="action-sheet__content" @click.stop>
          <slot/>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { lock, unlock } from 'tua-body-scroll-lock';

export default {
  name: 'ActionSheet',
  props: {
    visible: {
      type: Boolean,
      require: true,
    },
    scrollerId: {
      type: String,
      require: false,
      default: 'action-sheet-scroll',
    },
  },
  data() {
    return {
      isShowing: false,
    };
  },
  methods: {
    show() {
      this.isShowing = true;
      this.$nextTick(() => {
        lock(document.getElementById(this.scrollerId));
      });
    },
    close() {
      this.isShowing = false;
      this.$nextTick(() => {
        unlock(document.getElementById(this.scrollerId));
      });
    },
    modalClickHandler() {
      this.$emit('update:visible', false);
    },
  },
  beforeDestroy() {
    unlock();
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
};
</script>

<style lang="scss">
.action-sheet {
  z-index: var(--z-index-action);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--mask-action);
  backdrop-filter: blur(10px);
}

.action-sheet__content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--background-base);
  border-radius: .3rem .3rem 0 0;
}

.action-sheet-fade-enter-active, .action-sheet-fade-leave-active {
  transition: opacity 0.3s;
  opacity: 1;
}

.action-sheet-fade-enter, .action-sheet-fade-leave-active {
  opacity: 0;
}

.action-sheet-up-enter-active, .action-sheet-up-leave-active {
  transition: all 0.3s;
  transform: translateY(0);
}

.action-sheet-up-enter, .action-sheet-up-leave-active {
  transform: translateY(100%);
}
</style>
