<script lang="ts">
  let {names = [], values = [], selected_value, callback = () => {}} = $props();
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import Chips from "$lib/components/Chips.svelte";

  let supposed_selected_value = values[0];

  if (typeof window !== "undefined") {
      const selected_value_in_url = $page.url.hash;
      if(selected_value_in_url !== null && selected_value_in_url !== '') {
        if(selected_value_in_url.startsWith('#')) {
          supposed_selected_value = selected_value_in_url.substring(1);;
        }
        else {
          supposed_selected_value = selected_value_in_url;
        }
      }
  }
  callback(supposed_selected_value);
</script>
<Chips 
  names={names} 
  values={values}
  selected_value={selected_value}
  callback={(value) => {
    callback(value);
    if (typeof window !== "undefined") {
      goto($page.url.pathname+`#${selected_value}`);
    }
  }}
/>