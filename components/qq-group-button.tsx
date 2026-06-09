"use client"

import * as React from "react"
import { X } from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function QqGroupButton() {
  return (
    <Dialog>
      <DialogTrigger
        className="fixed top-1/2 z-40 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-2xl ring-1 ring-white/20 dark:ring-white/10 transition-shadow duration-200 hover:shadow-[0_0_24px_-4px_hsl(var(--primary))] active:scale-95 right-[max(1rem,calc((100vw-1152px)/2-96px))]"
        aria-label="添加客服微信"
      >
        <img src="/images/logo.png" alt="添加客服微信" className="size-full rounded-full object-cover" />
      </DialogTrigger>

      <DialogContent>
        <DialogClose className="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </DialogClose>

        <DialogHeader>
          <DialogTitle>添加客服微信</DialogTitle>
          <DialogDescription>扫码添加客服微信，获取最新信息</DialogDescription>
        </DialogHeader>

        {/* 二维码占位 */}
        <div className="flex size-48 items-center justify-center self-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
          <span className="text-center text-sm text-muted-foreground">
            客服微信二维码
            <br />
            （占位）
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
