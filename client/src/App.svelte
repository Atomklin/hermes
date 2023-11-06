<script lang="ts">
  import Auth from "./lib/panels/auth/Auth.svelte";
  import Login from "./lib/panels/auth/Login.svelte";
  import Dashboard from "./lib/panels/dashboard/index.svelte"
</script>

<main>
  <Auth>
    <Dashboard slot="authenticated" />
    <Login slot="login" />
  </Auth>
</main>
