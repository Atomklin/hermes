<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  let className = "shadow-xl px-4 py-5 w-full md:w-fit";
  export { className as class };
  
  const dispatch = createEventDispatcher();
</script>


<svelte:window on:keydown={(e) => { 
  if (e.key == "Escape") 
    dispatch("escape"); 
}}/>

<div class="fixed top-0 left-0 right-0 w-full overflow-x-hidden overflow-y-auto z-30" 
  out:fade={{ duration: 200 }} 
  tabindex="-1" >

  <div class="flex items-center justify-center min-h-screen">
    <!-- Background -->
    <div class="fixed z-40 inset-0 transition-opacity bg-black opacity-75" 
      on:click={() => { dispatch("escape") }}
      aria-hidden="true"
      tabindex="-1" />

    <!-- Foreground -->
    <div class="foreground z-50 rounded-lg {className}">
      <slot />
    </div>
  </div>
</div>


<style>
  .foreground { 
    background-color: #36393f; 
  }
</style>

