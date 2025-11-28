<script context="module" lang="ts">
  import { writable } from 'svelte/store'

  export type ConfirmOptions = {
    title?: string
    message?: string
    target: unknown | undefined
    confirmLabel?: string
    isDestructive?: boolean
    beforeConfirm?: (_: { target: any }) => boolean
    onConfirm: (_: { target: any }) => void
    onCancel?: (_: { target: any }) => void
    onClose?: (_: { target: any }) => void
  }
  export const confirm = writable<ConfirmOptions | null>(null)
  export function createConfirmable({
    title,
    message,
    target = null,
    confirmLabel,
    isDestructive = false,
    beforeConfirm = () => true,
    onConfirm = () => {},
    onCancel = () => {},
    onClose = () => {},
  }: ConfirmOptions) {
    confirm.set({
      title,
      message,
      target,
      confirmLabel,
      isDestructive,
      beforeConfirm,
      onConfirm,
      onCancel,
      onClose,
    })
  }
</script>

<script lang="ts">
  import BusyButton from '$components/form/BusyButton.svelte'
  import { Button } from '$ds/components/ui/button'
  import * as Dialog from '$ds/components/ui/dialog'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  const dispatch = createEventDispatcher()

  let open = false
  let latestOpenStatus = false
  let confirmBusy = false

  $: onOpenChange(open)
  $: onConfirmChange($confirm)

  // @ts-ignore
  $: ({
    title,
    message,
    target,
    onConfirm,
    onCancel,
    confirmLabel,
    isDestructive,
    beforeConfirm = () => true,
  } = $confirm || {})

  function onOpenChange(isOpen: boolean) {
    if (isOpen === latestOpenStatus) return

    latestOpenStatus = isOpen
    if (!isOpen) {
      $confirm = null
    }
  }

  function onConfirmChange(confirmValue: ConfirmOptions | null) {
    if (!confirmValue) return

    open = true
    latestOpenStatus = true
  }

  async function onConfirmDialog() {
    if (!onConfirm) return

    confirmBusy = true
    const shouldProceed = await beforeConfirm({ target })

    if (shouldProceed) {
      dispatch('confirm', { target })
      await onConfirm({ target })
      open = false
    }
    confirmBusy = false
  }

  function onCancelDialog() {
    if (!onCancel) return

    dispatch('cancel', { target })
    onCancel({ target })
    open = false
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Content>
      <Dialog.Title>{title || $_('Confirm Delete Item Title')}</Dialog.Title>
      <Dialog.Description>{message || $_('Confirm Delete Item Description')}</Dialog.Description>

      <slot></slot>

      <Dialog.Close />

      <Dialog.Footer class="max-md:gap-1">
        <Button variant="secondary" on:click={onCancelDialog}>
          {$_('Cancel')}
        </Button>
        <BusyButton
          busy={confirmBusy}
          variant={isDestructive ? 'destructive' : 'default'}
          on:click={onConfirmDialog}
          focus>
          {confirmLabel || $_('Confirm')}
        </BusyButton>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
