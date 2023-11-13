<script lang="ts">
  import { getRegimentIconURL } from "../../api/discord";
  import { selectedRegiment, type RegimentInfo } from "../../api/regiments";

  export let regiment: RegimentInfo;
</script>

<button class="w-full h-32 bg-zinc-600 hover:bg-zinc-500 rounded-md shadow-md grid grid-cols-3 grid-rows-3"
  on:click={() => selectedRegiment.set(regiment)}>
  <div class="col-start-1 col-end-4 row-start-1 row-end-3 bg-zinc-800 rounded-t-md w-full h-full"/>
  <div class="col-start-1 col-end-2 row-start-1 row-end-4 w-full h-full p-2">
    {#if regiment.icon}
      <img class="rounded-md w-full h-full object-cover "
        src={getRegimentIconURL(regiment.id, regiment.icon)} 
        alt="regiment-icon" >
    {:else}
      <div class="bg-zinc-900 rounded-full w-full h-full" />
    {/if}
  </div>
  <div class="col-start-2 col-end-4 row-start-1 row-end-4 w-full h-full flex justify-center items-end">
    <h2 class="text-white text-2xl font-bold mb-7 pr-3">
      {regiment.name}
    </h2>
  </div>
</button>

<style>
  button:hover > :first-child {
    --tw-bg-opacity: 1;
    background-color: rgb(63 63 70 / var(--tw-bg-opacity));
  }
</style>