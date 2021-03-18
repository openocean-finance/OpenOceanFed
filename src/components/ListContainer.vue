<template>
  <div>
    <LoadingGrid v-if="loading" class="list-container__loading"/>
    <EmptyView v-else-if="length === 0"/>
    <div v-else>
      <slot/>
    </div>
  </div>
</template>

<script>

import EmptyView from '@/components/EmptyView.vue';
import LoadingGrid from '@/components/LoadingGrid.vue';

export default {
  name: 'ListContainer',
  components: {
    LoadingGrid,
    EmptyView,
  },
  props: {
    length: {
      type: Number,
      require: true,
    },
    loading: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.list-container__loading {
  width: 100%;
  height: 2rem;
}
</style>
