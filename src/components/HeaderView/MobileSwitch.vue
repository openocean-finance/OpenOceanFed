<template>
  <div class="mobile-switch" :class="{active}">
    <div class="line"/>
    <div class="line second"/>
  </div>
</template>

<script>

export default {
  name: 'MobileSwitch',
  props: {
    active: {
      type: Boolean,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-switch {
  margin-right: .3rem;
  display: inline-block;
  position: relative;
  height: 0.18rem;
  width: .3rem;
  vertical-align: middle;

  &.active {
    .line {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);

      &.second {
        margin-top: 0;
        transform: translateY(-50%) rotate(-45deg);
      }
    }
  }

  &.dark {
    .line {
      background: var(--color-base);
    }
  }
}

.line {
  width: .3rem;
  height: .04rem;
  border-radius: 2px;
  background: var(--color-base);
  transition: transform .3s;

  &.second {
    margin-top: .1rem;
  }

}

</style>
