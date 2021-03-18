<template>
  <div class="g-container disconnect">
    <h3 class="title g-font-semi">Disconnect</h3>
    <CommonButton class="btn" label="Confirm" status="danger" @click="disconnect" />
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import showToast from '@/components/toast/index';
import { disconnectWalletConnect } from '@/utils/dApp';

export default {
  name: 'Disconnect',
  components: { CommonButton },
  methods: {
    async disconnect() {
      try {
        await disconnectWalletConnect();
        this.$nextTick(() => {
          this.$store.commit('RESET_STATE');
          this.$emit('success');
        });
      } catch (e) {
        showToast(e.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.disconnect {
  padding-top: .4rem;
  padding-bottom: .4rem;
}

.title {
  margin: 0;
  padding: 0;
  font-size: .36rem;
  line-height: .55rem;
}

.btn {
  margin-top: .4rem;
}
</style>
