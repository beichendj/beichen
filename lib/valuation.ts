import valuationJson from "@/data/valuation.json"

import type { FilterState } from "@/components/account-filter-sheet"

export type ValuationItem = {
  id: number
  account_no: string
  hafu_coins: number
  login_method: string
  rank: string
  secret_kd: number
  level: number
  experience_cards: number
  insurance_slots: string
  stamina: number
  load_capacity: number
  awm_bullets: number
  six_head_count: number
  six_armor_count: number
  deposit: number
  rental_days: number
  recycle_ratio: number
  recycle_rent: number
  knife_skin: string
  gun_skin: string
  weapon_skin: string
  remark: string
  owner_online_time: number
}

export type ValuationData = {
  data: {
    total: number
    page: number
    last_page: number
    limit: number
    list: ValuationItem[]
    price_multiplier: number
  }
}

const valuationData = valuationJson as ValuationData

export function getValuationList(): ValuationItem[] {
  return valuationData.data.list
}

/** 按编号、刀皮、枪皮、干员、段位等关键词搜索 */
export function applySearchQuery(rows: ValuationItem[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return rows

  return rows.filter((row) => {
    const searchable = [
      row.account_no,
      row.rank,
      row.knife_skin,
      row.gun_skin,
      row.weapon_skin,
      row.remark,
      row.login_method,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return searchable.includes(q)
  })
}

function parseLevel(value: string) {
  return Number(value.replace("级", ""))
}

function includesSkin(source: string, selected: string[]) {
  if (selected.length === 0) return true
  if (!source) return false
  const skins = source.split(/[,，]/).map((s) => s.trim())
  return selected.some((item) => skins.some((skin) => skin.includes(item)))
}

export function applyValuationFilters(
  rows: ValuationItem[],
  filters: FilterState
) {
  return rows.filter((row) => {
    if (
      filters.accountId &&
      !row.account_no.toLowerCase().includes(filters.accountId.toLowerCase())
    ) {
      return false
    }

    if (filters.staminaLevels.length > 0) {
      const levels = filters.staminaLevels.map(parseLevel)
      if (!levels.includes(row.stamina)) return false
    }

    if (filters.weightLevels.length > 0) {
      const levels = filters.weightLevels.map(parseLevel)
      if (!levels.includes(row.load_capacity)) return false
    }

    if (
      filters.safeSlots.length > 0 &&
      !filters.safeSlots.includes(row.insurance_slots)
    ) {
      return false
    }

    if (!includesSkin(row.knife_skin, filters.knifeSkins)) return false
    if (!includesSkin(row.gun_skin, filters.operatorSkins)) return false
    if (!includesSkin(row.weapon_skin, filters.gunSkins)) return false

    if (filters.hafuMin && row.hafu_coins < Number(filters.hafuMin)) return false
    if (filters.hafuMax && row.hafu_coins > Number(filters.hafuMax)) return false
    if (filters.awmMin && row.awm_bullets < Number(filters.awmMin)) return false
    if (filters.awmMax && row.awm_bullets > Number(filters.awmMax)) return false

    return true
  })
}

export type SortKey = "default" | "price" | "ratio" | "hafu"
export type SortDir = "asc" | "desc"

export function sortValuationList(
  rows: ValuationItem[],
  key: SortKey,
  dir: SortDir
) {
  if (key === "default") return rows

  const field =
    key === "price"
      ? "recycle_rent"
      : key === "ratio"
        ? "recycle_ratio"
        : "hafu_coins"

  return [...rows].sort((a, b) => {
    const diff = a[field] - b[field]
    return dir === "asc" ? diff : -diff
  })
}
