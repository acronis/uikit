'use client';

import {
  AccordionContainer,
  Card,
  CardContent,
  CardHeader,
  Section,
  SectionContent,
  SectionHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@acronis-platform/ui-react';
import { DatabaseIcon } from '@acronis-platform/icons-react/stroke-mono';

export function SectionDemo() {
  return (
    <div className="flex w-full flex-col">
      <Section hasBottomBorder>
        <SectionHeader
          title="Protected workloads"
          description="Everything backed up in the last 24 hours."
          hasDescription
          icon={<DatabaseIcon size={24} />}
        />
        <SectionContent>
          <Card className="w-full">
            <CardHeader
              title="Backup status"
              description="Last successful run 5 minutes ago."
              hasDescription
            />
            <CardContent>
              <p className="text-sm">
                All 24 workloads are protected and up to date.
              </p>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>

      <Section variant="column2-70-30" hasBottomBorder>
        <SectionHeader title="Storage overview" />
        <SectionContent>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm">
                Main content spans two of the three columns.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm">Side column.</p>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>

      <Section variant="grid3" hasBottomBorder>
        <SectionHeader title="Agents" />
        <SectionContent>
          <Card className="col-span-2">
            <CardContent className="pt-4">
              <p className="text-sm">This card spans two of the three columns.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm">Single column.</p>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>

      <Section variant="table" hasBottomBorder>
        <AccordionContainer collapsible defaultOpen>
          {({ open }) => (
            <>
              <SectionHeader
                title="Recent jobs"
                description={open ? 'Showing 3 jobs.' : 'Collapsed'}
                hasDescription
                isCollapsible
                collapseLabel="Toggle recent jobs"
              />
              <AccordionContainer.Content>
                <SectionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Daily backup</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weekly archive</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Replication</TableCell>
                        <TableCell>In progress</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </SectionContent>
              </AccordionContainer.Content>
            </>
          )}
        </AccordionContainer>
      </Section>
    </div>
  );
}
