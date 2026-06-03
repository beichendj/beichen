"use client"

import * as React from "react"
import { ChevronsUpDown, ListFilter } from "lucide-react"

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
  const [appliedFilters, setAppliedFilters] =
    React.useState<FilterState>(defaultFilterState)

  const rows = React.useMemo(() => {
    const searched = applySearchQuery(items, query)
    const filtered = applyValuationFilters(searched, appliedFilters)
    return sortValuationList(filtered, activeKey, sortDir)
  }, [items, query, activeKey, sortDir, appliedFilters])

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
        <div className="flex items-center gap-1">
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
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4">
        {rows.length > 0 ? (
          rows.map((item) => <AccountCard key={item.id} item={item} />)
        ) : (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            {query.trim()
              ? `未找到与「${query.trim()}」相关的账号`
              : "暂无符合条件的账号"}
          </p>
        )}
      </div>
    </div>
  )
}
