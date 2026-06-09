"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ValuationItem } from "@/lib/valuation"
import { cn } from "@/lib/utils"

type AccountCardProps = {
  item: ValuationItem
}

const loginMethodStyles: Record<string, string> = {
  QQ扫码:
    "bg-orange-500/10 text-orange-700 dark:bg-orange-400/12 dark:text-orange-300",
  VX扫码:
    "bg-violet-500/10 text-violet-700 dark:bg-violet-400/12 dark:text-violet-300",
  QQ账号密码:
    "bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300",
}

function splitSkins(value: string) {
  return value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildCopyText(item: ValuationItem) {
  const now = new Date()
  const h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, "0")
  const endDate = new Date(now.getTime() + item.rental_days * 24 * 60 * 60 * 1000)
  const eY = endDate.getFullYear()
  const eM = endDate.getMonth() + 1
  const eD = endDate.getDate()
  const end = `${eY}.${eM}.${eD}-${h}:${m}`
  return [
    `编号: ${item.account_no}`,
    `租金: ¥${item.recycle_rent}`,
    `押金: ¥${item.deposit}`,
    `租期: ${item.rental_days}天`,
    `时间: ${end}`,
  ].join("\n")
}

export function AccountCard({ item }: AccountCardProps) {
  const [copied, setCopied] = React.useState(false)

  const loginStyle =
    loginMethodStyles[item.login_method] ??
    "bg-muted/15 text-muted-foreground"

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildCopyText(item))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const knifeSkins = splitSkins(item.knife_skin)
  const gunSkins = splitSkins(item.gun_skin)
  const weaponSkins = splitSkins(item.weapon_skin)
  const hasSkins = knifeSkins.length > 0 || gunSkins.length > 0 || weaponSkins.length > 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card text-card-foreground shadow-[0_1px_3px_-1px_rgb(0_0_0/0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_8px_24px_-6px_rgb(0_0_0/0.1)] active:translate-y-0">

      {/* Accent: thin top bar */}
      <div className="h-0.5 bg-linear-to-r from-primary/40 to-primary/5" />

      {/* ── Row 1: account no (left) + price (right) ── */}
      <div className="flex items-start justify-between gap-3 px-3 pt-2 pb-0.5">
        <div className="min-w-0">
          <p className="truncate font-mono text-base font-semibold tracking-tight text-foreground">
            <span className="font-semibold text-muted-foreground/50">编号 </span>{item.account_no}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold leading-none tabular-nums tracking-tight text-primary">
            ¥{item.recycle_rent}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/40">
            押{item.deposit} · {item.rental_days}天
          </p>
        </div>
      </div>

      {/* ── Row 2: rank ── */}
      {item.rank && (
        <p className="px-3 pb-1.5 text-sm font-medium tracking-wide text-amber-700/70 dark:text-amber-300/70">
          {item.rank}
        </p>
      )}



      {/* ── Row 3: key metrics ── */}
      <div className="flex items-baseline gap-3 px-3 py-1">
        <div className="shrink-0">
          <p className="text-base font-bold tabular-nums text-foreground">
            <span className="font-bold text-muted-foreground">纯币 </span>{item.hafu_coins}M
          </p>
        </div>
        <div className="shrink-0">
          <p className="text-xs font-semibold tabular-nums text-red-600/70 dark:text-red-400/70">
            <span className="font-semibold text-red-500">比例 </span>1:{(item.hafu_coins / item.recycle_rent * 100).toFixed(0)}
          </p>
        </div>
      </div>




      {/* —— Badges —— */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-1">
        {/* Basic stats - amber */}
        <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">体力</span>
          <span className="text-foreground/85">{item.stamina}级</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">保险</span>
          <span className="text-foreground/85">{item.insurance_slots}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">负重</span>
          <span className="text-foreground/85">{item.load_capacity}级</span>
        </span>
        {item.experience_cards > 0 && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/8 px-1.5 py-0.5 text-sm font-medium">
            <span className="text-muted-foreground/50">钻石</span>
            <span className="text-foreground/85">{item.experience_cards}</span>
          </span>
        )}

        {/* Combat stats - sky */}
        <span className="inline-flex items-center gap-1 rounded-sm bg-sky-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">6头</span>
          <span className="text-foreground/85">{item.six_head_count}个</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-sky-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">6甲</span>
          <span className="text-foreground/85">{item.six_armor_count}个</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-sky-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">AW</span>
          <span className="text-foreground/85">{item.awm_bullets}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-sky-500/8 px-1.5 py-0.5 text-sm font-medium">
          <span className="text-muted-foreground/50">KD</span>
          <span className="text-foreground/85">{item.secret_kd}</span>
        </span>

        {/* Skins */}
        {knifeSkins.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-sm font-medium text-amber-700/80 dark:text-amber-300/80">
            刀皮：{knifeSkins.join(", ")}
          </span>
        )}
        {gunSkins.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-sky-500/10 px-1.5 py-0.5 text-sm font-medium text-sky-700/80 dark:text-sky-300/80">
            干员：{gunSkins.join(", ")}
          </span>
        )}
        {weaponSkins.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-muted/25 px-1.5 py-0.5 text-sm font-medium text-muted-foreground/70">
            枪皮：{weaponSkins.join(", ")}
          </span>
        )}

        {/* Login + Rental */}
        <span className={cn("inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-sm font-medium", loginStyle)}>
          {item.login_method}
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-500/8 px-1.5 py-0.5 text-sm font-medium text-emerald-700/80 dark:text-emerald-300/80">
          租期 {item.rental_days}天
        </span>
      </div>

      {item.remark && (
        <div className="px-3 py-1">
          <span className="inline-flex items-center gap-1 rounded-sm bg-muted/20 px-2 py-1 text-sm font-medium text-muted-foreground/70">
            备注：{item.remark}
          </span>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border/20 px-3 py-1">
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-7 w-full items-center justify-center gap-1.5 rounded-sm text-sm text-muted-foreground/50 transition-colors hover:bg-muted/10 hover:text-foreground/80"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600 dark:text-green-400" />
              已复制
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              复制信息
            </>
          )}
        </button>
      </footer>
    </article>
  )
}
