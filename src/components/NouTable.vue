<template>
  <div class="common-table">
    <table class="common-table__table">
      <thead>
      <tr>
        <th
          class="common-table__th"
          :class="{'common-table__th--fixed': fixedHeader}"
          v-for="item in headers"
          :key="item.id"
          :style="{width:item.width}"
        >
          {{ item.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex" @click="emitRowClick(row)">
        <td class="common-table__td" v-for="(col, colIndex) in cols" :key="col.id">
          <NouTableCell :tr="row" :td="col" :row-index="rowIndex" :col-index="colIndex"/>
        </td>
      </tr>
      </tbody>
    </table>
    <slot/>
    <template v-if="loading">
      <LoadingGrid class="common-table__loading"/>
      <LoadingGrid class="common-table__loading"/>
    </template>
  </div>
</template>

<script>

import LoadingGrid from '@/components/LoadingGrid.vue';
import NouTableCell from '@/components/NouTableCell';

export default {
  name: 'NouTable',
  components: {
    LoadingGrid,
    NouTableCell,
  },
  props: {
    data: {
      type: Array,
      require: true,
    },
    fixedHeader: {
      type: Boolean,
      require: false,
      default: false,
    },
    loading: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      cols: [],
      headers: [],
    };
  },
  methods: {
    emitRowClick(target) {
      this.$emit('clickRow', target);
    },
  },
};
</script>

<style lang="scss">

$tr-space: .1rem;
$cell-space: .1rem;

.common-table__table {
  min-width: 100%;
  border-collapse: collapse;
}

.common-table__th, .common-table__td {
  font-size: .22rem;
  line-height: .33rem;
  padding: 0 $cell-space 0 0;

  &:last-child {
    text-align: right;
    padding-right: 0;
  }

  &:first-child {
    text-align: left;
  }
}

.common-table__th {
  text-align: left;
  color: var(--color-des);
  font-weight: 400;
  white-space: nowrap;

  &.common-table__th--fixed {
    position: sticky;
    top: 0;
    background: var(--background-base);
  }
}

.common-table__td {
  padding-top: $tr-space;
}

.common-table__loading {
  margin-top: .1rem;
  height: .4rem;
}
</style>
