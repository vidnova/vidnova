import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@vidnova/ui';

interface CleanupEventsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const CleanupEventsPagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: CleanupEventsPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            size={'md'}
            href="#"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              size={'md'}
              href="#"
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 5 && <PaginationEllipsis />}
        <PaginationItem>
          <PaginationNext
            size={'md'}
            href="#"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
