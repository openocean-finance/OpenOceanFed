<template>
  <div class="chain-status" :class="`chain-status--${chain.toLowerCase()}`">
    <div class="chain-status__dot"/>
    <div class="chain-status__chain g-font-mid">{{ chain }}</div>
  </div>
</template>

<script>

export default {
  name: 'ChainStatus',
  props: {
    chain: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chain-status {
  padding: 0 .1rem;
  line-height: .33rem;
  border-radius: 1px;
  display: flex;
  justify-content: center;
  align-items: center;

  &--eth {
    background: var(--background-lighter);
    color: var(--color-base);

    .chain-status__dot {
      background: var(--color-base);
    }
  }

  &--ont {
    background: rgba(72, 163, 255, .1);
    color: rgba(72, 163, 255, 1);

    .chain-status__dot {
      background: rgba(72, 163, 255, 1);
    }
  }

  &--bsc {
    background: rgba(239, 186, 47, .1);
    color: rgba(239, 186, 47, 1);

    .chain-status__dot {
      background: rgba(239, 186, 47, 1);
    }
  }
}

.chain-status__dot {
  width: .1rem;
  height: .1rem;
  margin-right: .1rem;
  border-radius: 50%;
}

.chain-status__chain {
  font-size: .22rem;
}
</style>
