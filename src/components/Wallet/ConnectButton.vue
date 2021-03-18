<template>
  <button class="connect-button g-font-mid" @click="connect">Connect Wallet</button>
</template>

<script>

import { showWalletConnect } from '@/utils/dApp';

export default {
  name: 'ConnectButton',
  methods: {
    async connect() {
      showWalletConnect();
    },
  },
};
</script>

<style lang="scss" scoped>
.connect-button {
  box-sizing: border-box;
  height: .66rem;
  line-height: .66rem;
  font-size: .24rem;
  border-radius: var(--radius-common);
  border: none;
  padding: 0;
  outline: none;
  transition: opacity .3s;
  color: var(--color);
  background: transparent;

  &:hover {
    opacity: .8;
  }
}
</style>
