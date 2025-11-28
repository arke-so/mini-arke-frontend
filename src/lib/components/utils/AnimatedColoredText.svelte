<script lang="ts">
  export let text: string
</script>

<div
  class="animate-gradient bg-gradient-to-r from-blue-600 via-pink-400 to-blue-600 bg-clip-text text-2xl text-transparent {$$restProps.class ||
    ''}">
  {text}
</div>

<style>
  .animate-gradient {
    background-size: 300%;
    -webkit-animation: animatedgradient 4s ease infinite alternate;
    -moz-animation: animatedgradient 4s ease infinite alternate;
    animation: animatedgradient 4s ease infinite alternate;
  }

  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
