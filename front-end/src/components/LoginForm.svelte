<script lang="ts">
  import { login } from "../api/authentication";
  import Error from "./Error.svelte";
  import Loading from "./Loading.svelte";
  import Button from "./forms/Button.svelte";
  import TextInput from "./forms/TextInput.svelte";

  export let componentTitle: string;
  export let buttonTitle: string;
  export let errorMessage: string;

  let username = "";
  let password = "";
  let promise: Promise<void> | undefined;

  function submit() {
    promise = login(username, password);
  }
</script>

<form class="w-64 h-fit mx-auto px-11 py-5 gap-2  rounded-lg shadow-md bg-zinc-700  flex flex-col justify-center">
  <h1 class="text-3xl font-bold uppercase text-center mb-4">
    {componentTitle}
  </h1>
  <TextInput bind:value={username} id="username" placeholder="Username"/>
  <TextInput bind:value={password} id="password" placeholder="•••••••••" obscure />
  {#await promise}
    <Loading />
  {:catch} 
    <Error>
      {errorMessage}
    </Error>
  {/await}
  <span class="w-full mt-5">
    <Button on:click={submit} theme="Default">{buttonTitle}</Button>
  </span>
</form>
