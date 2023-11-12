<script lang="ts">
  import type { RegimentInfo } from "../../api/regiments";

  export let regiment: RegimentInfo;
</script>

<div>
  {regiment.name}
</div>