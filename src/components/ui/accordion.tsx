import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(
  (
    { className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    />
  )
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          `flex flex-1 items-center justify-between py-4 text-left text-base font-medium
          transition-all`,
          'hover:text-blue-600 dark:hover:text-blue-400',
          'focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        <svg
          className="ml-2 size-5 shrink-0 transition-transform data-[state=open]:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        `data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down
        overflow-hidden text-sm`,
        className
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
