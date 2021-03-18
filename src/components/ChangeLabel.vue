<template>
  <div class="change-label" :class="{'change-label--minus':num<0}">{{ num | formatLabel }}</div>
</template>

<script>

export default {
  name: 'ChangeLabel',
  props: {
    change: {
      type: [String, Number],
      require: true,
    },
  },
  computed: {
    num() {
      const num = Number(this.change);
      if (Number.isNaN(num)) {
        return 0;
      }
      return num;
    },
  },
  filters: {
    formatLabel(num) {
      return `${num < 0 ? '' : '+'}${num}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.change-label {
  color: var(--green)
}
.change-label--minus {
  color: var(--red)
}
</style>
