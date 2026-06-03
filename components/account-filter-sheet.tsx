"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type FilterState = {
  accountId: string
  staminaLevels: string[]
  weightLevels: string[]
  safeSlots: string[]
  knifeSkins: string[]
  operatorSkins: string[]
  gunSkins: string[]
  hafuMin: string
  hafuMax: string
  awmMin: string
  awmMax: string
}

export const defaultFilterState: FilterState = {
  accountId: "",
  staminaLevels: [],
  weightLevels: [],
  safeSlots: [],
  knifeSkins: [],
  operatorSkins: [],
  gunSkins: [],
  hafuMin: "",
  hafuMax: "",
  awmMin: "",
  awmMax: "",
}

const levelOptions = ["3级", "4级", "5级", "6级", "7级"]
const safeSlotOptions = ["2格", "4格", "6格", "9格"]
const knifeSkinOptions = [
  "信条",
  "影锋",
  "赤霄",
  "怜悯",
  "黑海",
  "北极星",
  "电锯惊魂",
  "龙牙",
  "暗星",
  "碎星",
]
const operatorSkinOptions = [
  "天际飞仙",
  "维什戴尔",
  "蚀金玫瑰",
  "水墨云图",
  "能天使",
  "霜叶",
]
const gunSkinOptions = [
  "M4A1/棱镜",
  "AK47/流光",
  "KC17/创世纪元",
  "AWM/苍穹",
  "SCAR/烈焰",
]

type AccountFilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: FilterState
  onChange: (value: FilterState) => void
  onConfirm: (value: FilterState) => void
}

function toggleItem(list: string[], item: string) {
  return list.includes(item)
    ? list.filter((i) => i !== item)
    : [...list, item]
}

function countActiveFilters(filters: FilterState) {
  let count = 0
  if (filters.accountId) count++
  count += filters.staminaLevels.length
  count += filters.weightLevels.length
  count += filters.safeSlots.length
  count += filters.knifeSkins.length
  count += filters.operatorSkins.length
  count += filters.gunSkins.length
  if (filters.hafuMin || filters.hafuMax) count++
  if (filters.awmMin || filters.awmMax) count++
  return count
}

function FilterPanel({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border/80 bg-muted/30 p-3.5",
        className
      )}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
    </div>
  )
}

function TagGroup({
  options,
  selected,
  onToggle,
  columns,
}: {
  options: string[]
  selected: string[]
  onToggle: (item: string) => void
  columns?: number
}) {
  return (
    <div
      className={cn(
        "gap-2",
        columns === 4 && "grid grid-cols-4",
        columns === 5 && "grid grid-cols-5",
        !columns && "flex flex-wrap"
      )}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className="inline-flex"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-auto w-full justify-center px-2.5 py-1.5 text-xs font-normal transition-colors",
                !isSelected &&
                  "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {option}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

function RangeInputs({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string
  max: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="最小"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        className="h-9 flex-1 bg-card"
      />
      <span className="shrink-0 text-muted-foreground">—</span>
      <Input
        type="number"
        placeholder="最大"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        className="h-9 flex-1 bg-card"
      />
    </div>
  )
}

export function AccountFilterSheet({
  open,
  onOpenChange,
  value,
  onChange,
  onConfirm,
}: AccountFilterSheetProps) {
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const activeCount = countActiveFilters(draft)

  function updateDraft(patch: Partial<FilterState>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function handleReset() {
    setDraft(defaultFilterState)
  }

  function handleConfirm() {
    onChange(draft)
    onConfirm(draft)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="max-h-[90vh] w-auto gap-0 rounded-t-xl border border-border bg-card p-0 shadow-xl data-[side=bottom]:inset-x-4 data-[side=bottom]:mx-auto data-[side=bottom]:max-w-6xl"
      >
        <SheetTitle className="sr-only">筛选条件</SheetTitle>
        <SheetDescription className="sr-only">
          设置账号筛选条件并应用
        </SheetDescription>

        <div className="flex max-h-[90vh] w-full flex-col">
          <div className="flex shrink-0 flex-col items-center border-b border-border bg-muted/40 pt-2 pb-0">
            <div className="mb-3 h-1 w-10 rounded-full bg-border" aria-hidden />
            <div className="flex w-full items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">
                  筛选条件
                </span>
                {activeCount > 0 ? (
                  <Badge variant="secondary" className="tabular-nums">
                    已选 {activeCount}
                  </Badge>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 gap-1 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <RotateCcw className="size-3.5" />
                重置
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <FilterPanel title="基础信息">
              <FilterField label="账号编号">
                <Input
                  placeholder="输入编号搜索"
                  value={draft.accountId}
                  onChange={(e) => updateDraft({ accountId: e.target.value })}
                  className="h-9 bg-card"
                />
              </FilterField>
            </FilterPanel>

            <FilterPanel
              title="账号属性"
              description="体力、负重与保险格数"
            >
              <div className="space-y-4">
                <FilterField label="体力等级">
                  <TagGroup
                    options={levelOptions}
                    selected={draft.staminaLevels}
                    columns={5}
                    onToggle={(item) =>
                      updateDraft({
                        staminaLevels: toggleItem(draft.staminaLevels, item),
                      })
                    }
                  />
                </FilterField>
                <FilterField label="负重等级">
                  <TagGroup
                    options={levelOptions}
                    selected={draft.weightLevels}
                    columns={5}
                    onToggle={(item) =>
                      updateDraft({
                        weightLevels: toggleItem(draft.weightLevels, item),
                      })
                    }
                  />
                </FilterField>
                <FilterField label="保险格数">
                  <TagGroup
                    options={safeSlotOptions}
                    selected={draft.safeSlots}
                    columns={4}
                    onToggle={(item) =>
                      updateDraft({
                        safeSlots: toggleItem(draft.safeSlots, item),
                      })
                    }
                  />
                </FilterField>
              </div>
            </FilterPanel>

            <FilterPanel title="皮肤筛选" description="支持多选">
              <div className="space-y-4">
                <FilterField label="刀皮">
                  <TagGroup
                    options={knifeSkinOptions}
                    selected={draft.knifeSkins}
                    onToggle={(item) =>
                      updateDraft({
                        knifeSkins: toggleItem(draft.knifeSkins, item),
                      })
                    }
                  />
                </FilterField>
                <FilterField label="干员红皮">
                  <TagGroup
                    options={operatorSkinOptions}
                    selected={draft.operatorSkins}
                    onToggle={(item) =>
                      updateDraft({
                        operatorSkins: toggleItem(draft.operatorSkins, item),
                      })
                    }
                  />
                </FilterField>
                <FilterField label="枪皮">
                  <TagGroup
                    options={gunSkinOptions}
                    selected={draft.gunSkins}
                    onToggle={(item) =>
                      updateDraft({
                        gunSkins: toggleItem(draft.gunSkins, item),
                      })
                    }
                  />
                </FilterField>
              </div>
            </FilterPanel>

            <FilterPanel title="数值范围">
              <div className="space-y-4">
                <FilterField label="哈夫币范围 (M)">
                  <RangeInputs
                    min={draft.hafuMin}
                    max={draft.hafuMax}
                    onMinChange={(hafuMin) => updateDraft({ hafuMin })}
                    onMaxChange={(hafuMax) => updateDraft({ hafuMax })}
                  />
                </FilterField>
                <FilterField label="AWM 子弹数">
                  <RangeInputs
                    min={draft.awmMin}
                    max={draft.awmMax}
                    onMinChange={(awmMin) => updateDraft({ awmMin })}
                    onMaxChange={(awmMax) => updateDraft({ awmMax })}
                  />
                </FilterField>
              </div>
            </FilterPanel>
          </div>

          <div className="shrink-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-card/80">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button
                type="button"
                className="h-10 flex-1"
                onClick={handleConfirm}
              >
                确定筛选
                {activeCount > 0 ? ` (${activeCount})` : ""}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
