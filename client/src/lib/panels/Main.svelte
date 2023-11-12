<script lang="ts">
  import { selectedRegiment } from "../api/regiments";

  import FullLogo from "../../assets/images/full-logo.png"
  import Dashboard from "./dashboard/index.svelte";
  import Regiments from "./regiments/index.svelte";
  import User from "./auth/User.svelte";

  function reset() {
    selectedRegiment.set(null);
  }
</script>

<header class="w-full flex flex-row justify-between py-3 px-8 border-b border-neutral-600">
  <button class="flex flex-row items-center gap-2" on:click={reset}>
    <img src={FullLogo} alt="mini-logo" class="h-10">
    <h1 class="font-mono font-bold uppercase text-2xl">
      hermes
    </h1>
  </button>
  <User/>
</header>
<div>
  {#if $selectedRegiment != null}
    <Dashboard /> 
  {:else}
    <Regiments />
  {/if}
</div>