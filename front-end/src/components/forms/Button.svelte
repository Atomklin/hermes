<script lang="ts">
  import { createEventDispatcher} from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let classNames: string = "";

  export let theme: "Default" | "Success" | "Danger" = "Default";
  export let type: HTMLButtonAttributes["type"] = "button";
  export let disabled = false;
  export { classNames as class };

  if (!classNames) {
    classNames = "w-full p-2 rounded-lg focus:outline focus:ring active:scale-90 "
    switch (theme) {
      case "Default": classNames += "text-white bg-blue-600 focus:bg-blue-400 hover:bg-blue-500"; break;
      case "Success": classNames += "text-white bg-green-600 focus:bg-green-400 hover:bg-green-500"; break;
      case "Danger":  classNames += "text-white bg-red-600 focus:bg-red-400 hover:bg-red-500"; break;
    }
  }

  const dispatch = createEventDispatcher();
</script>

<button {type} {disabled} class={classNames}
  on:click={() => { dispatch("click") }}>
  <slot />
</button>