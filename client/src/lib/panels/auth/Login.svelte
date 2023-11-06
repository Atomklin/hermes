<script lang="ts">
  import { _ } from "svelte-i18n";

  import FullSizeLogo from "../../../assets/images/full-logo.png";
  import Button from "../../components/forms/Button.svelte";
  import Modal from "../../components/Modal.svelte";

  let showModal = false;

  function redirectToAuth() {
    window.location.pathname = "/api/auth/login";
  }
</script>

<div class="flex w-72 md:w-1/3 mx-auto flex-col justify-center text-center">
  <img class="md:mt-40 mx-auto drop-shadow-2xl w-96"
    alt="full-size-logo" 
    src={FullSizeLogo}>
  <h1 class="text-6xl font-black font-mono -translate-y-24 m-0 p-0">
    Hermes
  </h1>
  <p class="w-72 -translate-y-20 font-mono mx-auto">
    {$_("login.description")}
  </p>
  <div class="w-48 mx-auto md:mt-10 flex flex-col gap-3">
    <Button theme="Success" on:click={redirectToAuth}>
      <p class="px-2 pt-1 font-bold uppercase">
        {$_("login.auth-button")}
      </p>
    </Button>
    <Button theme="Secondary" on:click={() => { showModal = true }}>
      <p class="px-2 pt-1 font-bold uppercase">
        {$_("login.about.button")}
      </p>
    </Button>
  </div>
</div>

{#if showModal}
  <Modal on:escape={() => { showModal = false }}>
    <div class="md:w-96">
      <div class="flex flex-row justify-between mb-4 w-full">
        <h2 class="font-bold text-xl">{$_("login.about.title")}</h2>
        <button class="font-bold" on:click={() => { showModal = false }}>
          X
        </button>
      </div>
      <div class="bg-zinc-800 p-2 rounded-md">
        <p class="font-semibold mb-3">{$_("login.about.details")}</p>
        <h3 class="font-semibold">{$_("login.about.credits")}</h3>
        <ul class="list-disc px-4 text-sm">
          <li>Atomklin</li>
          <li>Heinrich</li>
          <!-- Always looking for more contributors -->
        </ul>
        <h3 class="font-semibold mt-3">
          {$_("login.about.privacy.title")}
        </h3>
        <p class="mb-1">{$_("login.about.privacy.details")}</p>
        <ul class="list-disc px-4 text-sm">
          <li>{$_("login.about.privacy.0")}</li>
          <li>{$_("login.about.privacy.1")}</li>
          <li>{$_("login.about.privacy.2")}</li>
        </ul>
      </div>
    </div>
  </Modal>
{/if}