<script lang="ts">
  import { getUserInfo, user } from "../../api/authentication";
  import Loading from "../../components/Loading.svelte";

  let auth = getUserInfo();
  auth.then((info) => user.set(info));
</script>

<div>
  {#await auth}
    <Loading />
  {:then}
    <slot name="authenticated"/>
  {:catch} 
    <slot name="login" />
  {/await}
</div>