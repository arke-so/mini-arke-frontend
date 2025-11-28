import type { FormUtilAPI } from "$components/form/FormUtil.svelte";
import { vi } from "vitest";

export function createFormAPI(overrides: Partial<FormUtilAPI> = {}): FormUtilAPI {
  return {
    errorMessage: null,
    errors: {},
    isValid: true,
    form: {},
    state: {},
    handleReset: vi.fn(),
    handleChange: vi.fn(),
    updateField: vi.fn(),
    validateField: vi.fn(),
    updateValidateField: vi.fn(),
    setPostSubmitOption: vi.fn(),
    triggerSubmit: vi.fn(),
    register: vi.fn(),
    inflight: false,
    locked: false,
    ...overrides,
  }
}