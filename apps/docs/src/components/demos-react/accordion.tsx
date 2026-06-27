'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@acronis-platform/ui-react';

export function AccordionDemo() {
  return (
    <div style={{ width: 420 }}>
      <Accordion defaultValue={['plan']}>
        <AccordionItem value="plan">
          <AccordionTrigger>What is included in the plan?</AccordionTrigger>
          <AccordionContent>
            Backup, recovery, and anti-malware for all registered workloads.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="devices">
          <AccordionTrigger>How many devices can I protect?</AccordionTrigger>
          <AccordionContent>
            Up to the seat count in your subscription; add more at any time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>Do you offer 24/7 support?</AccordionTrigger>
          <AccordionContent>
            Yes — support is available around the clock for all paid tiers.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
