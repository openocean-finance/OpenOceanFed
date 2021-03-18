<template>
  <div class="loading">
    <svg class="circular" viewBox="0 0 50 50">
      <circle
        class="circular__circle"
        cx="25"
        cy="25"
        :r="(50-stroke)/2"
        fill="none"
        :stroke-width="stroke"
        stroke-linecap="round">
      </circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    stroke: {
      type: Number,
      require: false,
      default: 6,
    },
  },
};
</script>

<style lang="scss">
.loading {
  vertical-align: middle;
  width: 16px;
  display: inline-block;
  position: relative;

  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .circular {
    position: absolute;
    top: 0;
    left: 0;
    animation: loading__rotate 2s linear infinite;
  }

  circle {
    animation: loading__circle-dash 1.5s ease-in-out infinite;
    stroke: #fff;
  }
}

@keyframes loading__circle-dash {
  0% {
    stroke-dasharray: 1, 125;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -25px;
  }
  100% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -125px;
  }
}

@keyframes loading__rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
