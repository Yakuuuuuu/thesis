import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const RequestSchema = z.object({
  category: z.enum(["food", "housekeeping", "other"], {
    required_error: "Please choose a service type.",
  }),
  details: z
    .string()
    .min(3, "Please provide a few details (min 3 chars)")
    .max(500, "Keep it under 500 characters"),
})

export type ServiceRequestValues = z.infer<typeof RequestSchema>

export type ServiceRequestModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (values: ServiceRequestValues) => void
  className?: string
  roomNumber?: string | number
}

export function ServiceRequestModal({
  open,
  onOpenChange,
  onSubmit,
  className,
  roomNumber,
}: ServiceRequestModalProps) {
  const form = useForm<ServiceRequestValues>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      category: undefined as unknown as ServiceRequestValues["category"],
      details: "",
    },
  })

  function handleSubmit(values: ServiceRequestValues) {
    onSubmit?.(values)
    onOpenChange(false)
    // Parent can also show toast upon success
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>Request Room Service</DialogTitle>
          <DialogDescription>
            Choose a service type and add any details we should know.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {roomNumber ? (
              <div className="text-sm text-muted-foreground">
                Room <span className="font-medium text-foreground">{roomNumber}</span>
              </div>
            ) : null}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        <SelectItem value="food">Food order</SelectItem>
                        <SelectItem value="housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. 1x Margherita pizza, extra napkins"
                      className="min-h-[96px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceRequestModal
