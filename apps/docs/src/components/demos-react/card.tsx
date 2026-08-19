'use client';

import {
  AccordionContainer,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@acronis-platform/ui-react';

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader
        title="Backup status"
        description="Last successful run 5 minutes ago."
        hasDescription
        isSwitchable
        defaultSwitchChecked
      />
      <CardContent>
        <p className="text-sm">
          All 24 workloads are protected and up to date.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>View report</Button>
        <Button variant="secondary">Run now</Button>
      </CardFooter>
    </Card>
  );
}

export function CardCollapsibleDemo() {
  return (
    <Card className="w-[350px]">
      <AccordionContainer collapsible defaultOpen>
        {({ open }) => (
          <>
            <CardHeader
              title="Backup policy"
              description={
                open
                  ? 'Applies to 12 workloads.'
                  : '12 workloads · last run 5 minutes ago'
              }
              hasDescription
              isCollapsible
              collapseLabel="Toggle backup policy"
            />
            <AccordionContainer.Content>
              <CardContent>
                <p className="text-sm">
                  Collapse the card to hide the content while keeping the
                  header visible.
                </p>
              </CardContent>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </Card>
  );
}
