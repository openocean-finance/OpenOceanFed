<template>
  <div
    class="label-span g-font-mid"
    :class="{'label-span--minus': num < 0}"
  >
    {{ label | formatLabel }}
  </div>
</template>

<script>

import { getFixed } from '@/utils/number';

export default {
  name: 'LabelSpan',
  props: {
    label: {
      type: String,
      require: true,
    },
  },
  computed: {
    num() {
      const num = Number(this.label);
      if (Number.isNaN(num)) {
        return 0;
      }
      return num;
    },
  },
  filters: {
    formatLabel(num) {
      const number = getFixed(num, 2);
      return `${number < 0 ? '' : '+'}${number}%`;
    },
  },
};
</script>

<style lang="scss">
.label-span {
  display: inline-block;
  padding: 0 .2rem;
  height: .42rem;
  line-height: .42rem;
  background: var(--green-light);
  border-radius: .1rem;
  font-size: .22rem;
  color: var(--green);
}

.label-span--minus {
  color: var(--red);
  background: var(--red-light);
}
</style>
