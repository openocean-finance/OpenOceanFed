<template>
  <div class="header-mobile" :class="{'header-mobile--unfold':unfold}">
    <header>
      <div class="header-mobile__switch" @click="handleChange">
        <MobileSwitch class="" :active="unfold"/>
      </div>
      <i class="iconfont iconLogoBlack header-mobile__logo"/>
    </header>
    <transition name="nav-fold">
      <div v-if="unfold" class="header-mobile__nav">
        <ProLink v-if="show.includes('pro')" class="header-mobile__nav__item"/>
        <ProLink v-if="show.includes('classic')" class="header-mobile__nav__item" label="Classic" classic />
        <NouFoldTransition>
          <SelectChain v-if="isClassicUnfold"/>
        </NouFoldTransition>
        <a
          v-if="show.includes('api')"
          class="header-mobile__nav__item"
          href="https://docs.openocean.finance/API.html"
          target="_blank"
        >
          API
        </a>
        <a
          v-if="show.includes('docs')"
          class="header-mobile__nav__item"
          href="https://docs.openocean.finance/"
          target="_blank"
        >
          DOCS
        </a>
        <a
          v-if="show.includes('blog')"
          class="header-mobile__nav__item"
          href="https://openoceanglobal.medium.com/"
          target="_blank"
        >
          BLOG
        </a>
      </div>
    </transition>
  </div>
</template>

<script>

import SelectChain from '@/components/SelectChain';
import NouFoldTransition from '@/components/common/FoldTransition';
import FoldSwitch from '@/components/HeaderView/FoldSwitch';
import ProLink from '@/components/ProLink';
import MobileSwitch from './MobileSwitch';

export default {
  name: 'HeaderMobile',
  components: {
    ProLink, FoldSwitch, NouFoldTransition, SelectChain, MobileSwitch,
  },
  props: {
    show: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      unfold: false,
      isClassicUnfold: false,
    };
  },
  methods: {
    handleChange() {
      this.unfold = !this.unfold;
      if (this.unfold) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    switchClassic() {
      this.isClassicUnfold = !this.isClassicUnfold;
    },
  },
};
</script>

<style lang="scss" scoped>

.header-mobile {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  overflow: hidden;
  transition: all .3s;
  backdrop-filter: blur(20px);

  &.header-mobile--unfold {
    height: 100vh;
  }
}

.header-mobile__switch {
  position: absolute;
  top: .34rem;
  left: .5rem;
  width: .5rem;
  height: .5rem;
  line-height: .5rem;
  text-align: center;
}

.header-mobile__logo {
  vertical-align: middle;
  font-size: .5rem;
}

.header-mobile__nav {
  padding: .5rem;
  text-align: left;
}

.header-mobile__nav__item {
  display: block;
  font-size: .34rem;
  line-height: .8rem;
  color: inherit;
  font-weight: 400;
  font-family: Poppins-Medium, Poppins, serif;
}

.header-mobile__nav__item--fold {
  display: flex;
  align-items: center;
}

.header-mobile__nav__item--fold__label {
  flex: 1;
}
</style>

<style lang="scss">
.nav-fold {
  &-enter-active, &-leave-active {
    transition: all .3s;
    z-index: -1;
  }

  &-enter, &-leave-to {
    transform: translateY(-100%);
  }
}
</style>
