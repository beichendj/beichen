"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const slides = [
  {
    title: "精选推荐",
    subtitle: "热门账号 · 限时优惠",
    badge: "HOT",
    border: "border-primary/30",
  },
  {
    title: "新上架",
    subtitle: "每日更新 · 即租即用",
    badge: "NEW",
    border: "border-amber-500/25",
  },
  {
    title: "安全保障",
    subtitle: "全程托管 · 放心租赁",
    badge: "SAFE",
    border: "border-emerald-500/25",
  },
]

export function HomeCarousel() {
  const autoplay = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  )

  return (
    <Carousel
      className="w-full overflow-hidden rounded-lg border border-border/40 bg-card shadow-[0_1px_4px_-1px_rgb(0_0_0/0.06)]"
      opts={{ loop: true }}
      plugins={[autoplay.current]}
    >
      <CarouselContent className="ml-0">
        {slides.map((slide) => (
          <CarouselItem key={slide.title} className="pl-0">
            <div
              className={`flex h-28 flex-col justify-center gap-1.5 border-l-4 bg-card px-5 sm:h-32 ${slide.border}`}
            >
              <span className="inline-flex w-fit rounded-sm border border-current/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                {slide.badge}
              </span>
              <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {slide.title}
              </h2>
              <p className="text-xs text-muted-foreground/60 sm:text-sm">
                {slide.subtitle}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
