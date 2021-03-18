<template>
  <div :class="version">
    <div class="header-mask">
      <div class="header-mask__header">
        <MobileSwitch :active="isMenuShowing" @click.native="$emit('close')"/>
      </div>
      <div class="header-mask__menu">
        <a href="https://openocean.finance">Home</a>
        <a href="https://www.binance.org/en/bridge">Bridge</a>
        <a v-if="isClassic" href="/pro">Go Pro</a>
        <a v-else href="/classic">Go Classic</a>
      </div>
    </div>
  </div>
</template>

<script>

import MobileSwitch from '@/components/HeaderView/MobileSwitch.vue';

export default {
  name: 'HeaderMask',
  components: { MobileSwitch },
  props: {
    isMenuShowing: {
      type: Boolean,
      require: true,
    },
    isClassic: {
      type: Boolean,
      require: false,
      default: false,
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
.android {
  .header-mask {
    background-color: var(--background);
  }
}

.header-mask {
  z-index: var(--z-index-header-mask);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(40px);
  display: flex;
  flex-direction: column;
}

.header-mask__header {
  height: var(--header-height);
  line-height: var(--header-height);
  padding: 0 var(--space-common) 0 var(--space-common);
  display: flex;
  align-items: center;
}

.header-mask__menu {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 var(--space-common);

  a {
    display: block;
    color: inherit;
    text-decoration: none;
    font-size: .34rem;
    line-height: .8rem;
    font-weight: 400;
    font-family: Poppins-Medium, Poppins, serif;
  }
}
</style>
