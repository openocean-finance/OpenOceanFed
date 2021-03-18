<template>
  <div class="empty-view">
    <img class="empty-view__icon g-light-only" src="../assets/images/empty-dark.svg" alt="">
    <img class="empty-view__icon g-dark-only" src="../assets/images/empty.svg" alt="">
    <div class="empty-view__label">No Record</div>
  </div>
</template>

<script>

export default {
  name: 'EmptyView',
};
</script>

<style lang="scss">
.empty-view {
  padding: .4rem 0;
  background: var(--background);
  border-radius: var(--radius-common);
  text-align: center;
  font-size: 0;
}

.empty-view__icon {
  height: .6rem;
}

.empty-view__label {
  margin-top: .3rem;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-des);
}
</style>
