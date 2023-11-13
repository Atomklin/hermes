<script lang="ts">
  import { _ } from "svelte-i18n";

  import { getRegiments, regiments } from "../../api/regiments";
  
  import Loading from "../../components/Loading.svelte";
  import Regiment from "./Regiment.svelte";
</script>

<div class="flex w-96 mx-auto flex-col justify-center items-center gap-3">
  {#await getRegiments()}
    <Loading />
  {:then} 
    <h1 class="text-2xl md:text-xl font-black mt-8 mb-3">
      {$_("regiments.title")}
    </h1>
    {#if $regiments != null}
      {#each $regiments as regiment}
        <Regiment {regiment} /> 
      {/each}
    {:else}
      {$_("regiments.empty")}
    {/if}
  {/await}
</div>