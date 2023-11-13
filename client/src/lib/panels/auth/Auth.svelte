<script lang="ts">
  import { getUserInfo, user } from "../../api/users";
  import Loading from "../../components/Loading.svelte";
</script>

<div class="w-full">
  {#await getUserInfo()}
    <Loading>
      <h1 slot="bottom" class="text-white z-50 mt-5">
        Fetching user info...
      </h1>
    </Loading>

  {:then}
    {#if $user != null}
      <slot name="authenticated"/>
    {:else}
      <slot name="login" />
    {/if}

  {:catch} 
    <slot name="login" />
  {/await}
</div>