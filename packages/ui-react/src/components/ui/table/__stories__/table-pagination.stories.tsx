import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TablePagination } from '../table-pagination';

const meta = {
  title: 'UI/Table/Pagination',
  component: TablePagination,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    pageIndex: 0,
    pageCount: 5,
    pageSize: 10,
    onPageIndexChange: () => {},
    onPageSizeChange: () => {},
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePagination({
  initialPageIndex = 2,
  selectedRows,
}: {
  initialPageIndex?: number;
  selectedRows?: number;
}) {
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(10);
  return (
    <div className="w-[720px]">
      <TablePagination
        pageIndex={pageIndex}
        pageCount={5}
        pageSize={pageSize}
        totalRows={48}
        selectedRows={selectedRows}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractivePagination initialPageIndex={2} selectedRows={4} />,
};

export const FirstPage: Story = {
  render: () => <InteractivePagination initialPageIndex={0} />,
};
