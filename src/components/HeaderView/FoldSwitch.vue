<template>
  <div class="fold-switch" :class="{active}">
    <div class="fold-switch__line"/>
    <div class="fold-switch__line second"/>
  </div>
</template>

<script>

export default {
  name: 'FoldSwitch',
  props: {
    active: {
      type: Boolean,
      require: true
    }
  }
};
</script>

<style lang="scss">
.fold-switch {
  position: relative;
  display: inline-block;
  width: .2rem;
  height: .2rem;

  &.active {
    .fold-switch__line {
      &.second {
        display: none;
      }
    }
  }

  @media (min-width: 750px) { // pc
    width: 20px;
    height: 20px;
  }
}

.fold-switch__line {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: .2rem;
  height: .04rem;
  background: #000;

  &.second {
    transform: translateY(-50%) rotate(90deg);
  }

  @media (min-width: 750px) { // pc
    width: 20px;
    height: 4px;
  }
}

</style>
