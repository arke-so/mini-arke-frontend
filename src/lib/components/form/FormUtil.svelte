<script context="module" lang="ts">
  import type { CustomFormValues as IAMCustomFormValues } from '$api/iam'
  import type { CustomFormValues as ProductCustomFormValues } from '$api/product'
  import type { CustomFormValues as SalesCustomFormValues } from '$api/sales'
  import type { CustomFormValues as SupplyCustomFormValues } from '$api/supply'

  export type DefaultFormValues = {
    version: number
    customFormValues: SupplyCustomFormValues | IAMCustomFormValues | SalesCustomFormValues | ProductCustomFormValues
  }

  export type BasicFormMap = Record<string, any>
  export type ArkeFormMap = DefaultFormValues & BasicFormMap

  export type FormUtilContext = any

  export type FormUtilAPI = {
    form: BasicFormMap
    errors: Partial<BasicFormMap>
    state: BasicFormMap
    isValid: boolean
    inflight: boolean
    locked: boolean
    errorMessage: string | null
    errorResponse: any | null
    handleChange: (event: Event) => void
    handleReset: () => void
    updateField: (name: string, value: any) => void
    validateField: (name: string) => void
    updateValidateField: (name: string, value: any) => void
    register: (observer: (isValid?: boolean) => void) => void
    triggerSubmit: (option?: SubmitOption) => void
    setPostSubmitOption: (option: SubmitOption | null) => void
  }

  export type SuccessCallbackPayload<T = any> = {
    result: T
    option: SubmitOption
  }
  export type FailureCallbackPayload = {
    error: any
    message: string
    response?: unknown | null
  }
  export type OnSuccessCallback = (payload: SuccessCallbackPayload) => void
  export type SubmitOption = string | null
  export type FormSuccessEvent<T> = CustomEvent<{ result: T; option: SubmitOption }>

  export function getBasicDefaultFormValues() {
    return {
      customFormValues: {},
      version: 1,
    }
  }

  export function createFormValues<T extends BasicFormMap>(values: T): T & ArkeFormMap {
    return {
      ...getBasicDefaultFormValues(),
      ...values,
    }
  }
</script>

<script lang="ts">
  import { dev } from '$app/environment'
  import { DEFAULT_ERROR_MESSAGE, extractErrorMessage } from '$utils/errors'
  import { stringifyJSON } from '$utils/json'
  import { createEventDispatcher, onMount } from 'svelte'
  import { createForm } from 'svelte-forms-lib'
  import { _ } from 'svelte-i18n'

  export let initialValues: BasicFormMap = {}
  export let validate: (values: BasicFormMap) => Partial<BasicFormMap> = () => ({})
  export let afterFormSubmit: (values: ArkeFormMap) => Promise<any> = async () => {}
  export let beforeFormSubmit: (values: BasicFormMap, formAPI: FormUtilAPI) => Promise<boolean> = async () => true
  export let submitter: HTMLInputElement | null = null
  export let triggerSuccessEvent: boolean = true
  export let triggerFailureEvent: boolean = true
  export let locked: boolean = false
  export let novalidate: boolean = true
  export let onInit: (formApi: FormUtilAPI) => void = () => {}
  export let onSuccess: OnSuccessCallback = () => {}
  export let onFailure: (payload: FailureCallbackPayload) => void = () => {}

  let errorMessage: string | null = null
  let errorResponse: unknown | null = null
  let inflight: boolean = false
  let observers: Array<(isValid?: boolean) => void> = []
  let formAPI: FormUtilAPI
  let postSubmitOption: SubmitOption = null
  let changedTimer: NodeJS.Timeout | null = null
  let formChanged: boolean = false
  let initialState: string | null = null

  const dispatch = createEventDispatcher()
  const {
    form,
    errors,
    state,
    isValid,
    handleChange,
    handleSubmit,
    handleReset,
    updateInitialValues,
    updateField,
    validateField,
    updateValidateField,
  } = createForm({
    initialValues: createFormValues(initialValues),
    validate,
    onSubmit,
  })

  async function onSubmit(values: ArkeFormMap) {
    if (inflight) return
    if (!(await beforeFormSubmit(values, formAPI))) return

    inflight = true
    errorMessage = null
    errorResponse = null

    try {
      const result = await afterFormSubmit(values)
      if (triggerSuccessEvent) {
        dispatch('success', {
          option: postSubmitOption,
          result,
        })
        onSuccess({
          option: postSubmitOption,
          result,
        })
      }
    } catch (error: any) {
      if (dev) console.info('FormUtil', error)

      try {
        const { message, response } = await extractErrorMessage(error)
        errorMessage = $_(message)
        errorResponse = response

        if (dev) console.info('Server error:', response || 'No response')
      } catch (e) {
        if (dev) console.error('FormUtil ex:', e)
        errorMessage = $_(DEFAULT_ERROR_MESSAGE)
      }
      if (triggerFailureEvent) {
        dispatch('failure', { error, errorMessage })
        onFailure({
          error,
          message: errorMessage,
          response: errorResponse,
        })
      }
    } finally {
      inflight = false
      dispatch('complete')
    }
  }

  function triggerSubmit(option?: SubmitOption) {
    if (!submitter) return
    if (option) postSubmitOption = option

    submitter.click()
  }

  function loadItem(item: Partial<BasicFormMap> | null) {
    if (!item) return

    updateInitialValues(createFormValues(item))
    initialState = stringifyJSON($form)
  }

  function onSubmitEvent(event: Event) {
    if (locked) {
      event.preventDefault()
      return
    }

    for (const observer of observers) observer($isValid)
    handleSubmit(event)
  }

  function registerObserver(observer: (isValid?: boolean) => void) {
    observers.push(observer)
  }

  function setPostSubmitOption(option: SubmitOption | null) {
    postSubmitOption = option
  }

  function onFormChange(formStore: BasicFormMap) {
    if (changedTimer) clearTimeout(changedTimer)

    changedTimer = setTimeout(() => {
      formChanged = stringifyJSON(formStore) !== initialState
    }, 300)
  }

  $: loadItem(initialValues)
  $: onFormChange($form)
  $: formAPI = {
    form: $form,
    errors: $errors,
    state: $state,
    isValid: $isValid,
    inflight,
    locked,
    errorMessage,
    errorResponse,
    handleChange,
    handleReset,
    updateField,
    validateField,
    updateValidateField,
    triggerSubmit,
    register: registerObserver,
    setPostSubmitOption,
  }

  onMount(() => onInit(formAPI))
</script>

<form on:submit={onSubmitEvent} {novalidate}>
  <input bind:this={submitter} type="submit" class="hidden" aria-hidden="true" tabindex="-1" />
  <slot {formAPI} {errorMessage} {triggerSubmit} {formChanged} />
</form>
