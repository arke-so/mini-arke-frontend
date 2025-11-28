<script lang="ts">
  import * as Switch from '$ds/components/ui/switch'
  import { createEventDispatcher } from 'svelte'

  export let id: string
  export let name: string
  export let checked: boolean
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  function onCheckedChange(value: boolean) {
    dispatch('change', {
      target: {
        id,
        name,
        value,
      },
    })
  }
</script>

<Switch.Root {id} {name} {checked} {disabled} {onCheckedChange} />
