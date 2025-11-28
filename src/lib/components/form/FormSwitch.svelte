<script lang="ts">
  import { Label } from '$ds/components/ui/label'
  import * as Switch from '$ds/components/ui/switch'
  import { _ } from 'svelte-i18n'

  export let name: string = 'active'
  export let id: string = name
  export let checked: boolean = false
  export let formAPI: any = null
  export let label: string = $_('Active')
  export let showLabel: boolean = true
  export let labelClass: string = ''
  export let disabled: boolean = false
  export let onChange: (value: boolean) => void = () => {}

  function onCheckedChange(value: boolean) {
    onChange(value)
    checked = value
    if (!formAPI) return
    formAPI.updateField(name, value)
  }

  function loadValue(value: boolean) {
    if (value === undefined) return

    checked = value
  }

  $: loadValue(formAPI?.form[name])
  $: ({ class: className, ...rest } = $$restProps)
</script>

<div class="flex gap-2 {$$restProps.class || 'items-center'}">
  <Switch.Root {id} {name} {disabled} bind:checked {onCheckedChange} {...rest} />
  <Label for={name} id="label-{id}" class="{showLabel ? '' : 'sr-only'} {labelClass || ''}">
    <slot>{label}</slot>
  </Label>
</div>
