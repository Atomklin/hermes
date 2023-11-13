<script lang="ts">
  import { _ } from "svelte-i18n";

  import { getUserAvatarURL } from "../../api/discord";
  import { logout, user } from "../../api/users";
</script>

{#if $user != null}
  <div class="relative cursor-pointer bg-zinc-800 hover:bg-zinc-700 rounded-md h-fit flex flex-row gap-2 justify-center items-center"
    id="user-button">
    {#if $user.icon}
      <img class="object-cover rounded-l-lg h-8"
        src={getUserAvatarURL($user.id, $user.icon)}
        alt="user-avatar">
    {/if}
    <h1 class="text-lg font-bold">
      {$user.username}
    </h1>
    <svg class="w-3 h-3 rotate-180 shrink-0 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
    </svg>
    <div class="hidden z-10 bg-zinc-600 absolute w-full translate-y-9 shadow-xl rounded-b-md flex-col justify-center pb-2"
      id="dropdown">
      <!-- Add Language Select -->
      <button class="h-8 w-full hover:bg-zinc-500 font-bold" on:click={logout}>
        {$_("user-options.logout")}
      </button>
    </div>
  </div>
{/if}

<style>
  #dropdown:focus-within,
  #dropdown:hover,
  #user-button:hover > #dropdown {
    display: block;
  }
</style>