<script lang="ts">
  import Auth from "./lib/panels/auth/Auth.svelte";
  import Login from "./lib/panels/auth/Login.svelte";
  import MainPanel from "./lib/panels/Main.svelte";
</script>

<main>
  <Auth>
    <MainPanel slot="authenticated"/>
    <Login slot="login" />
  </Auth>
</main>
