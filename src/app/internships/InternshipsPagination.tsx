"use client";
import Pagination from "../components/Pagination";

export default function InternshipsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseQuery
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  baseQuery: URLSearchParams;
}) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      baseQuery={baseQuery}
    />
  );
}
