"use client"

import * as React from "react"
import { Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { useSearch } from "@/components/search-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const { query, setQuery } = useSearch()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 px-4 py-3 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="BeiCheng" className="size-9 rounded object-cover" />
          <span className="text-base font-semibold tracking-wide">北辰商行</span>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索编号、刀皮、枪皮、段位…"
              className="h-9 bg-background pl-8"
              aria-label="搜索账号"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="切换主题"
            title="切换暗黑/高亮"
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  )
}
