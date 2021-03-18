<template>
  <div class="header-menu">
    <NouFoldTransition @leave="leaveHandler">
      <ul v-if="isShow" class="header-menu__menu g-font-mid">
        <li
          v-for="item in menus"
          :key="item.label"
          class="header-menu__menu__item"
          @click="item.action"
        >
          {{ item.label }}
        </li>
      </ul>
    </NouFoldTransition>
  </div>
</template>

<script>

import NouFoldTransition from '@/components/FoldTransition';

export default {
  name: 'HeaderMenu',
  components: { NouFoldTransition },
  data() {
    return {
      isShow: false,
      onClose: () => {},
      menus: [],
    };
  },
  methods: {
    leaveHandler() {
      this.removeEl();
      this.$nextTick(() => {
        this.onClose();
      });
    },
    removeEl() {
      this.$el.parentNode.removeChild(this.$el);
      this.$destroy();
    },
    handleBlur() {
      this.isShow = false;
      document.body.removeEventListener('mousedown', this.handleBlur);
    },
    showMenu() {
      this.isShow = true;
      this.$nextTick(() => {
        document.body.addEventListener('mousedown', this.handleBlur);
      });
    },
  },
  mounted() {
    this.showMenu();
  },
};
</script>

<style lang="scss">
.header-menu {
  z-index: var(--z-index-header-menu);
  position: fixed;
  right: var(--space-common);
  top: 1rem;
  width: 2.9rem;
  overflow: hidden;
}

.header-menu__menu {
  margin: 0;
  padding: 0 .2rem;
  border-radius: .1rem;
  background: var(--background-header-menu);
  list-style: none;
  text-align: center;
  font-size: .24rem;
  backdrop-filter: blur(20px);
}

.header-menu__menu__item {
  margin: 0;
  padding: 0;
  line-height: .74rem;

  & + & {
    border-top: 1px solid var(--border-light);
  }
}
</style>
