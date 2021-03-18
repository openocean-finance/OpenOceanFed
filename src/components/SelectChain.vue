<template>
  <ul class="select-chain">
    <li
      v-for="item in chains"
      :key="item.value"
      class="select-chain__item g-font-mid"
      @click="$emit('select', item.value)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>

export default {
  name: 'SelectChain',
  data() {
    return {
      chains: [
        {
          label: 'ETH',
          value: 'ETH',
        },
        {
          label: 'BTC',
          value: 'BTC',
        },
        {
          label: 'ONT',
          value: 'ONT',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.select-chain {
  margin: 0;
  padding: 0;
  list-style: none;
}

.select-chain__item {
  display: block;
  margin: 0;
  padding: 0;
  line-height: .73rem;
  font-size: .24rem;
  color: var(--color-content);
}
</style>
