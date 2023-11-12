<script lang="ts">
  import { _ } from "svelte-i18n";

  import { getRegiments, regiments } from "../../api/regiments";
  
  import Loading from "../../components/Loading.svelte";
  import Regiment from "./Regiment.svelte";
</script>

<div class="flex w-72 md:w-1/3 mx-auto flex-col justify-center text-center">
  {#await getRegiments()}
    <Loading />
  {:then} 
    <h1 class="text-3xl font-black mt-8">
      {$_("regiments.title")}
    </h1>
    {#if $regiments != null}
      {#each $regiments as regiment}
        <Regiment {regiment} /> 
      {/each}
    {:else}
      <div class="mt-3">
        {$_("regiments.empty")}
      </div>
    {/if}
  {/await}
</div>