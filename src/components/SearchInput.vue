<template>
  <input class="search-input" type="text" v-bind="$attrs" :value="value" @input="inputHandler">
</template>

<script>

export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  methods: {
    inputHandler(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="scss">
.search-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  border: 2px solid var(--background);
  background: var(--background);
  padding: 0 .3rem 0 .75rem;
  height: .66rem;
  line-height: .66rem;
  border-radius: var(--radius-common);
  outline: none;
  font-size: .24rem;
  font-family: inherit;
  color: inherit;
  background-image: url("~@/assets/images/search.svg");
  background-size: .24rem;
  background-repeat: no-repeat;
  background-position: .3rem center;
  transition: border-color .3s;

  &::placeholder {
    color: var(--color-des);
  }

  &:focus {
    border-color: var(--blue);
  }
}

.g-dark {
  .search-input {
    background-image: url("~@/assets/images/search-dark.svg");
  }
}
</style>
