<script lang="ts">
  import { _ } from "svelte-i18n";

  import { getUserAvatarURL } from "../../api/discord";
  import { logout, user } from "../../api/users";

  import Modal from "../../components/Modal.svelte";
  import Button from "../../components/forms/Button.svelte";

  let showModal = false;
</script>

{#if $user != null}
  <button class="bg-zinc-800 rounded-md p-2 flex flex-row gap-2 justify-center items-center"
    on:click={() => { showModal = true }}>
    {#if $user.icon}
      <img class="h-8 rounded-xl"
        src={getUserAvatarURL($user.id, $user.icon)}
        alt="user-avatar">
    {/if}
    <h1 class="text-white text-lg font-bold">
      {$user.username}
    </h1>
  </button>
{/if}

{#if showModal}
  <Modal on:escape={() => { showModal = false }}
      class="shadow-xl px-4 py-5 w-fit">
    <div class="w-56">
      <div class="flex flex-row justify-between mb-4 w-full">
        <h2 class="font-bold text-xl">{$_("user-options.title")}</h2>
        <button class="font-bold" on:click={() => { showModal = false }}>
          X
        </button>
      </div>
      <Button theme="Danger" on:click={logout}>
        {$_("user-options.logout")}
      </Button>
    </div>
  </Modal>
{/if}