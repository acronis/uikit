import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@acronis-platform/shadcn-uikit/react'

export function PaginationLastPage() {
  const [currentPage, setCurrentPage] = useState(20)

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(1)
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {[16, 17, 18, 19, 20].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(page)
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < 20) setCurrentPage(currentPage + 1)
              }}
              className={currentPage === 20 ? 'pointer-events-none opacity-30' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-center text-sm text-muted-foreground">
        Current page: {currentPage} of 20
      </div>
    </div>
  )
}
