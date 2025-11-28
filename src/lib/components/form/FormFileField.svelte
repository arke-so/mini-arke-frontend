<script lang="ts">
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { type Variant } from '$ds/components/ui/button'
  import { Input } from '$ds/components/ui/input'
  import { DEFAULT_UPLOAD_MAX_SIZE_MB } from '$fixtures/constants'
  import { busy } from '$stores/app'
  import { notifyError } from '$utils/notifications'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import BusyButton from './BusyButton.svelte'
  import { FormFieldClass, type FileReadData } from './form'

  export let name: string = 'file'
  export let value: string | undefined = undefined
  export let id: string = name
  export let disabled: boolean = false
  export let label: string = $_('Upload')
  export let variant: Variant = 'secondary'
  export let maxSizeMB: number = DEFAULT_UPLOAD_MAX_SIZE_MB
  export let asText: boolean = false
  export let multiple: boolean = false
  export let maxFiles: number | undefined = undefined
  export let onError: ((error: Error) => void) | undefined = undefined
  export let onFileRead: ((data: FileReadData) => void) | undefined = undefined

  interface FileReaderConfig {
    file: File
    index: number
    onSuccess: (result: string, index: number) => void
    onComplete: () => void
  }

  let ref: HTMLInputElement | null = null

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  function onClick() {
    ref?.click()
  }

  function validateFiles(files: File[]): Error | null {
    if (multiple && maxFiles !== undefined && files.length > maxFiles) {
      return new Error($_('Max Files Exceeded Message', { values: { maxFiles } }))
    }

    const oversizedFile = files.find(file => file.size > maxSizeBytes)
    if (oversizedFile) {
      return new Error($_('File Size Exceeded Message', { values: { maxSizeMB } }))
    }

    return null
  }

  function createFileReader(config: FileReaderConfig): FileReader {
    const reader = new FileReader()

    reader.onload = () => {
      const result = asText
        ? (reader.result as string)
        : (reader.result as string).substring((reader.result as string).indexOf(';base64,') + 8)
      config.onSuccess(result, config.index)
      config.onComplete()
    }

    reader.onerror = () => {
      handleError(new Error($_('File Read Error Message')))
      config.onComplete()
    }

    asText ? reader.readAsText(config.file) : reader.readAsDataURL(config.file)
    return reader
  }

  function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    const files = Array.from(input.files)
    const validationError = validateFiles(files)

    if (validationError) {
      handleError(validationError)
      input.value = ''
      return
    }

    if (!multiple) {
      processSingleFile(files[0], input)
    } else {
      processMultipleFiles(files, input)
    }
  }

  function processSingleFile(file: File, input: HTMLInputElement) {
    createFileReader({
      file,
      index: 0,
      onSuccess: result => {
        if (onFileRead) {
          onFileRead(asText ? { file, text: result } : { file, base64String: result })
        }
      },
      onComplete: () => {
        input.value = ''
      },
    })
  }

  function processMultipleFiles(files: File[], input: HTMLInputElement) {
    let processedCount = 0
    const results = asText ? ([] as string[]) : ([] as string[])

    const onComplete = () => {
      if (++processedCount === files.length) {
        if (onFileRead) {
          onFileRead(asText ? { file: files, text: results } : { file: files, base64String: results })
        }
        input.value = ''
      }
    }

    files.forEach((file, index) => {
      createFileReader({
        file,
        index,
        onSuccess: (result, idx) => {
          results[idx] = result
        },
        onComplete,
      })
    })
  }

  function handleError(error: Error) {
    onError ? onError(error) : notifyError({ title: $_('Error'), description: error.message })
  }

  onMount(() => (ref = document.querySelector(`#${id}`)))
</script>

<div class="sr-only">
  <Input
    type="file"
    {id}
    {name}
    {disabled}
    {multiple}
    class="{$$restProps.class || ''} {FormFieldClass.MaxWidth}"
    {...$$restProps}
    bind:value
    on:change={onFileChange}
    on:input
    on:focus
    on:keyup
    on:blur />
</div>

<BusyButton busy={$busy} {disabled} {variant} on:click={onClick}>
  <IcoNoir.Upload class="{IconSize.Small} mr-1" />
  {label}
</BusyButton>
