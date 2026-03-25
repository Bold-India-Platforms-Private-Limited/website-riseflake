import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';

interface CustomPaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const CustomPagination = ({
  totalItems,
  currentPage,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: CustomPaginationProps) => {
  const [jumpValue, setJumpValue] = useState('');

  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);
    pages.add(Math.max(currentPage - 1, 1));
    pages.add(Math.min(currentPage + 1, totalPages));

    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const handleJumpSubmit = () => {
    const page = Number(jumpValue);
    if (!Number.isInteger(page)) {
      return;
    }

    const safePage = Math.min(Math.max(page, 1), totalPages);
    onPageChange(safePage);
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
      <div className="text-slate-600 text-sm font-medium">
        {startItem} - {endItem} / {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-md border border-slate-300 bg-white disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-md border border-slate-300 bg-white disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-10 min-w-10 px-3 rounded-md border text-sm font-semibold ${
              page === currentPage
                ? 'bg-blue-800 text-white border-blue-800'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-md border border-slate-300 bg-white disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-md border border-slate-300 bg-white disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm">Per page</span>
          <select
            value={String(pageSize)}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              onPageSizeChange(Number(event.target.value));
            }}
            className="h-10 rounded-md border border-slate-300 bg-white px-3"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Jump To</span>
          <input
            value={jumpValue}
            onChange={(event) => setJumpValue(event.target.value.replace(/[^0-9]/g, ''))}
            onBlur={handleJumpSubmit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleJumpSubmit();
              }
            }}
            className="h-10 w-24 rounded-md border border-slate-300 bg-white px-3"
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
