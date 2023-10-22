<script lang="ts">
  import { login } from "../api/authentication";
  import { getLanguageCode } from "../api/utils";
  import Button from "./forms/Button.svelte";
  import TextInput from "./forms/TextInput.svelte";

  export let componentTitle: string;
  export let buttonTitle: string;
  export let errorMessage: string;

  let username = "";
  let password = "";
  let hasError = false;

  /** @todo improve */

  async function onSubmit() {
    if (!username || !password)
      hasError = true;

    const { status } = await login(username, password);
    if (status !== 200)
      hasError = true;
    else {
      const language = getLanguageCode();
      window.location.pathname = "/" + language + "/dashboard";
    }
  }
</script>

<form class="w-64 h-fit mx-auto px-11 py-5 gap-2  rounded-lg shadow-md bg-zinc-700  flex flex-col justify-center {hasError ? "ring ring-red-500" : ""}">
  <h1 class="text-3xl font-bold uppercase text-center mb-4">
    {componentTitle}
  </h1>
  <TextInput bind:value={username} id="username" placeholder="Username"/>
  <TextInput bind:value={password} id="password" placeholder="•••••••••" obscure />
  {#if hasError}
    <p class="text-red-500 text-sm">{errorMessage}</p>
  {/if}
  <span class="w-full mt-5">
    <Button on:click={onSubmit} theme="Default">{buttonTitle}</Button>
  </span>
</form>