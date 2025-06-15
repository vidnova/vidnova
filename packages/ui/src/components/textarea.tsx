import * as React from "react"

import { cn } from "../lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground border-secondary-foreground border hover:bg-secondary-foreground transition-colors rounded-xl bg-secondary aria-invalid:ring-destructive/20 text-accent flex field-sizing-content min-h-16 w-full px-3 py-2 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
