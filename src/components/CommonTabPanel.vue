<template>
  <div v-if="isActive">
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'CommonTabPanel',
  props: {
    label: {
      type: String,
      require: true,
    },
    name: {
      type: [String, Number],
      require: true,
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    emitChange() {
      const parent = this.$parent;
      if (parent.$options.name !== 'CommonTab') {
        throw new Error('No CommonTab parent');
      }
      parent.publicUpdateData();
    },
  },
  watch: {
    label() {
      this.emitChange();
    },
    name() {
      this.emitChange();
    },
  },
};
</script>
