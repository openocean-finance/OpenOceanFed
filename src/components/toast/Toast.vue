<template>
  <transition name="nou-toast-fade" @after-leave="handleAfterLeave">
    <div
      v-show="show"
      class="nou-toast g-font-mid"
      :class="{'danger': type==='danger'}"
      :style="style"
    >
      {{ text }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NouToast',
  computed: {
    style() {
      return {
        top: `${this.top}px`,
      };
    },
  },
  data() {
    return {
      text: '',
      duration: 5000,
      uid: '',
      onClose: null,
      timer: null,
      show: false,
      top: 20,
      id: '',
      type: 'danger', // success/danger
    };
  },
  methods: {
    resetTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.closeMessage();
      }, this.duration);
    },
    closeMessage() {
      if (this.onClose) {
        this.onClose();
      }
      this.handleClose();
      this.show = false;
    },
    handleAfterLeave() {
      this.$el.parentNode.removeChild(this.$el);
      this.$destroy();
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  mounted() {
    this.show = true;
    this.$nextTick(() => {
      this.resetTimer();
    });
  },
};
</script>

<style lang="scss" scoped>

.nou-toast {
  z-index: var(--z-index-toast);
  box-sizing: border-box;
  opacity: 1;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  min-height: 42px;
  line-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 276px;
  text-align: center;
  font-size: 13px;
  transition: top .3s ease;
  border-radius: 6px;
  background: rgba(6, 46, 245, .9);
  color: #fff;

  &.danger {
    background: var(--background-toast-fail);
  }
}

.nou-toast-fade-enter,
.nou-toast-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.nou-toast-fade-enter-active, .nou-toast-fade-leave-active {
  transition: all .3s ease;
}
</style>
