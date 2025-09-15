<script lang="ts">
  let {names = [], values = [], selected_value, key_name='chip_selected', callback = () => {}} = $props();
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  import Chips from "$lib/components/Chips.svelte";
  
  let supposed_selected_value = values[0];

  if (typeof window !== "undefined") {
      const selected_value_in_url = page.url.searchParams.get(key_name);
      if(selected_value_in_url !== null && selected_value_in_url !== '') {
        supposed_selected_value = selected_value_in_url;
      }
  }

  callback(supposed_selected_value);
</script>
<Chips 
  names={names} 
  values={values}
  selected_value={selected_value}
  callback={(value: any) => {
    const default_behaviour = callback(value);
    if (default_behaviour && typeof window !== "undefined") {
      const url = new URL(page.url);
      url.searchParams.set(key_name, selected_value);
      goto(url);
      // history.pushState({}, '', url);
    }
  }}
/>