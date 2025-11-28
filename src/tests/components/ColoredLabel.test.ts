import ColoredLabel from '$components/badges/ColoredLabel.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('ColoredLabel.svelte', () => {
  const LABEL_TEXT = 'text'

  it('Renders with basic props', () => {
    const { container, getByText } = render(ColoredLabel, { props: { label: LABEL_TEXT } })

    expect(container).toBeDefined()
    expect(getByText(LABEL_TEXT)).toBeTruthy()
  })

  it('Applies the right classes if variant is success', () => {
    const { container, getByText } = render(ColoredLabel, { props: { label: LABEL_TEXT, variant: 'success', } })

    expect(container).toBeDefined()
    expect(getByText(LABEL_TEXT)).toHaveClass('bg-success/20')
  })

  it('Applies the right classes if variant is error', () => {
    const { container, getByText } = render(ColoredLabel, { props: { label: LABEL_TEXT, variant: 'error', } })

    expect(container).toBeDefined()
    expect(getByText(LABEL_TEXT)).toHaveClass('bg-rose-400/40')
  })

  it('Applies the right classes if variant is info', () => {
    const { container, getByText } = render(ColoredLabel, { props: { label: LABEL_TEXT, variant: 'info', } })

    expect(container).toBeDefined()
    expect(getByText(LABEL_TEXT)).toHaveClass('bg-info/20')
  })

  it('Applies the right classes if variant is info', () => {
    const { container, getByText } = render(ColoredLabel, { props: { label: LABEL_TEXT, variant: 'warning', } })

    expect(container).toBeDefined()
    expect(getByText(LABEL_TEXT)).toHaveClass('bg-amber-500/20')
  })
});