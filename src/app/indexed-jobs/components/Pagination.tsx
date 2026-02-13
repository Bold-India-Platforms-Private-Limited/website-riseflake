import Pagination from '../../components/Pagination'
import { useEffect, useState } from 'react'

export default function IJobsPagination({ page, limit, total }: { page: number, limit: number, total: number }) {
  const totalPages = Math.ceil(total / limit)
  const [baseQuery, setBaseQuery] = useState<URLSearchParams>(new URLSearchParams())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseQuery(new URLSearchParams(window.location.search))
    }
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto">
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        baseQuery={baseQuery}
      />
    </div>
  )
}
