<script lang="ts">
  let classNames = "bg-zinc-600 text-white  rounded-md  w-full px-2 py-1 focus:outline focus:ring focus:outline-blue-500";
  let labelClassNames = "text-xs font-bold mb-2";
  
  export let value: string;

  export let id: string;
  export let label: string | undefined = undefined;
  export let placeholder = id;
  export let obscure = false;
  export let required = false;
  export let disabled = false;
  export { classNames as class, labelClassNames };
</script>


<div>
  {#if label}
    <label for={id} class={labelClassNames} >
      {label}
    </label>
  {/if}
  
  <!-- To resolve issue with 'type' attribute not being able to be dynamic if input uses two-way binding -->
  {#if obscure} 
    <input type="password" {id} {placeholder} {required} {disabled} 
      class={classNames}
      bind:value>
  {:else}
    <input type="text" {id} {placeholder} {required} {disabled} 
      class={classNames}
      bind:value>
  {/if}
</div>