import type { Button as ButtonPrimitive } from 'bits-ui'
import { type VariantProps, tv } from 'tailwind-variants'
import Root from './button.svelte'

const buttonVariants = tv({
  base: 'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
      secondary:
        'bg-secondary/30 text-secondary-foreground border-secondary border border-solid hover:bg-secondary dark:hover:bg-secondary/50',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      ghostDestructive: 'text-destructive hover:bg-destructive hover:text-destructive-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type Variant = VariantProps<typeof buttonVariants>['variant']
export type Size = VariantProps<typeof buttonVariants>['size']

type Props = ButtonPrimitive.Props & {
  variant?: Variant
  size?: Size
  focus?: boolean
}

type Events = ButtonPrimitive.Events

export {
  //
  Root as Button,
  Root,
  buttonVariants,
  type Events as ButtonEvents,
  type Props as ButtonProps,
  type Events,
  type Props,
}
