"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsUpDown, ListFilter } from "lucide-react"

import { AccountCard } from "@/components/account-card"
import {
  AccountFilterSheet,
  defaultFilterState,
  type FilterState,
} from "@/components/account-filter-sheet"
import { useSearch } from "@/components/search-provider"
import { cn } from "@/lib/utils"
import {
  applySearchQuery,
  applyValuationFilters,
  sortValuationList,
  type SortDir,
  type SortKey,
  type ValuationItem,
} from "@/lib/valuation"

const sortOptions = [
  { key: "default" as const, label: "默认" },
  { key: "price" as const, label: "价格" },
  { key: "ratio" as const, label: "比例" },
  { key: "hafu" as const, label: "哈夫币" },
]

type AccountTableProps = {
  items: ValuationItem[]
}

export function AccountTable({ items }: AccountTableProps) {
  const { query } = useSearch()
  const [activeKey, setActiveKey] = React.useState<SortKey>("default")
  const [sortDir, setSortDir] = React.useState<SortDir>("desc")
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterState>(defaultFilterState)
  const [appliedFilters, setAppliedFilters] = React.useState<FilterState>(defaultFilterState)
  const [page, setPage] = React.useState(1)

  const rows = React.useMemo(() => {
    const searched = applySearchQuery(items, query)
    const filtered = applyValuationFilters(searched, appliedFilters)
    return sortValuationList(filtered, activeKey, sortDir)
  }, [items, query, activeKey, sortDir, appliedFilters])

  const pageSize = 9
  const totalPages = Math.ceil(rows.length / pageSize)
  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize)

  // Reset page when filters/search change
  React.useEffect(() => { setPage(1) }, [rows.length])


  const hasActiveFilters =
    JSON.stringify(appliedFilters) !== JSON.stringify(defaultFilterState)

  function handleSortClick(key: SortKey) {
    if (key === "default") {
      setActiveKey("default")
      return
    }

    if (activeKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setActiveKey(key)
      setSortDir("desc")
    }
  }

  return (
    <div className="rounded-lg border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/30 bg-muted/8 px-2 sm:px-4">
          {sortOptions.map((option) => {
          const isActive =
            option.key === "default"
              ? activeKey === "default"
              : activeKey === option.key

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSortClick(option.key)}
              className={cn(
                "flex items-center justify-center gap-1 py-2.5 text-sm transition-colors",
                isActive
                  ? "font-medium text-primary"
                  : "text-muted-foreground/60 hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              {option.label}
              {option.key !== "default" && (
                <ChevronsUpDown className="size-3.5 shrink-0 opacity-70" />
              )}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={cn(
            "flex items-center justify-center gap-1 py-2.5 text-sm transition-colors",
            filterOpen || hasActiveFilters
              ? "font-medium text-primary"
              : "text-muted-foreground/60 hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          筛选
          <ListFilter className="size-3.5 shrink-0 opacity-70" />
        </button>
      </div>

      <AccountFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={filters}
        onChange={setFilters}
        onConfirm={setAppliedFilters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 sm:p-3">
        {rows.length > 0 ? (
          paginatedRows.map((item) => <AccountCard key={item.id} item={item} />)
        ) : (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            {query.trim()
              ? `未找到与「${query.trim()}」相关的账号`
              : "暂无符合条件的账号"}
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-border/30 px-2 py-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn("inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors", page <= 1 ? "text-muted-foreground/30 cursor-not-allowed" : "text-muted-foreground hover:bg-muted/10 hover:text-foreground")}
          >
            <ChevronLeft className="size-3.5" />
            上一页
          </button>
          {Array.from({ length: totalPages }, (_, j) => j + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn("inline-flex items-center justify-center rounded-md px-2.5 py-1 text-sm tabular-nums transition-colors min-w-[32px]", p === page ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground/60 hover:bg-muted/10 hover:text-foreground")}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={cn("inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors", page >= totalPages ? "text-muted-foreground/30 cursor-not-allowed" : "text-muted-foreground hover:bg-muted/10 hover:text-foreground")}
          >
            下一页
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>

  )
}
