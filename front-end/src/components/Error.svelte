<script lang="ts">
  let classNames = "border border-solid p-2 rounded text-sm text-red-500";
  export { classNames as class };
</script>

<div class={classNames}>
  <slot />
</div>

<style>
  div {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    background-color: #ff3a3b1a;
    border-color: #ff3a3b;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>