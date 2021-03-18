<template>
  <div class="loading-grid"/>
</template>

<script>

export default {
  name: 'LoadingGrid',
};
</script>

<style lang="scss">
.loading-grid {
  background: var(--background);
  border-radius: var(--radius-common);
  animation: loading-grid-loading 2s infinite;
}

@keyframes loading-grid-loading {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
